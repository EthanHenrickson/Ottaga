import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OttagaOpenAIProvider } from './OttagaOpenAIProvider';
import type { LLMConfig, ChatMessage } from '$lib/types';

// Mock OpenAI client
vi.mock('openai', () => ({
	default: vi.fn().mockImplementation(() => ({
		chat: {
			completions: {
				create: vi.fn()
			}
		}
	}))
}));

const mockConfig: LLMConfig = {
	apiKey: 'test-api-key',
	baseUrl: 'https://api.example.com',
	model: 'test-model',
	systemPrompt: 'Test system prompt',
	temperature: 0.7,
	maxTokens: 100
};

const mockMessages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];

describe('OttagaOpenAIProvider', () => {
	let provider: OttagaOpenAIProvider;

	beforeEach(() => {
		provider = new OttagaOpenAIProvider(mockConfig);
		vi.clearAllMocks();
	});

	describe('constructor', () => {
		it('initializes OpenAI client with correct config', () => {
			expect(provider).toBeDefined();
			// @ts-expect-error accessing private property
			expect(provider.client).toBeDefined();
		});
	});

	describe('callCompletion', () => {
		it('returns success with content on valid response', async () => {
			// @ts-expect-error accessing private property
			provider.client.chat.completions.create.mockResolvedValue({
				id: 'test-id',
				object: 'chat.completion',
				created: 1234567890,
				model: 'test-model',
				choices: [
					{
						index: 0,
						message: {
							role: 'assistant',
							content: 'Test response'
						},
						finish_reason: 'stop'
					}
				]
			});

			const result = await provider.callCompletion(mockMessages);
			expect(result).toEqual({
				success: true,
				data: 'Test response'
			});
		});

		it('returns failure on empty content', async () => {
			// @ts-expect-error accessing private property
			provider.client.chat.completions.create.mockResolvedValue({
				id: 'test-id',
				object: 'chat.completion',
				created: 1234567890,
				model: 'test-model',
				choices: [
					{
						index: 0,
						message: {
							role: 'assistant',
							content: null
						},
						finish_reason: 'stop'
					}
				]
			});

			const result = await provider.callCompletion(mockMessages);
			expect(result).toEqual({ success: false });
		});

		it('strips reasoning tokens when showReasoningTokens=false', async () => {
			// @ts-expect-error accessing private property
			provider.client.chat.completions.create.mockResolvedValue({
				id: 'test-id',
				object: 'chat.completion',
				created: 1234567890,
				model: 'test-model',
				choices: [
					{
						index: 0,
						message: {
							role: 'assistant',
							content: '<think>Reasoning</think>Final answer'
						},
						finish_reason: 'stop'
					}
				]
			});

			const result = await provider.callCompletion(mockMessages, false);
			expect(result).toEqual({
				success: true,
				data: 'Final answer'
			});
		});
	});

	describe('callStreaming', () => {
		it('yields chunks for valid streaming response', async () => {
			const mockStream = new ReadableStream({
				start(controller) {
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({ choices: [{ delta: { content: 'Chunk1' }, finish_reason: null }] }) +
								'\n'
						)
					);
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({ choices: [{ delta: { content: 'Chunk2' }, finish_reason: null }] }) +
								'\n'
						)
					);
					controller.close();
				}
			});

			// @ts-expect-error accessing private property
			provider.client.chat.completions.create.mockResolvedValue({
				toReadableStream: () => mockStream
			});

			const generator = provider.callStreaming(mockMessages);
			const results = [];
			for await (const chunk of generator) {
				results.push(chunk);
			}

			expect(results).toEqual([
				{ success: true, data: 'Chunk1' },
				{ success: true, data: 'Chunk2' }
			]);
		});

		it('filters reasoning tokens when showReasoningTokens=false', async () => {
			const mockStream = new ReadableStream({
				start(controller) {
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({ choices: [{ delta: { content: '<think>' }, finish_reason: null }] })
						)
					);
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({
								choices: [{ delta: { content: 'Reasoning' }, finish_reason: null }]
							})
						)
					);
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({ choices: [{ delta: { content: '</think>' }, finish_reason: null }] })
						)
					);
					controller.enqueue(
						new TextEncoder().encode(
							JSON.stringify({ choices: [{ delta: { content: 'Answer' }, finish_reason: null }] })
						)
					);
					controller.close();
				}
			});

			// @ts-expect-error accessing private property
			provider.client.chat.completions.create.mockResolvedValue({
				toReadableStream: () => mockStream
			});

			const generator = provider.callStreaming(mockMessages, false);
			const results = [];
			for await (const chunk of generator) {
				results.push(chunk);
			}

			expect(results).toEqual([{ success: true, data: 'Answer' }]);
		});
	});
});

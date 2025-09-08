import type { ChatMessage } from '$lib/types';
import { OttagaHealthLLM } from '../Ottaga';
import { beforeEach, expect, it, vi } from 'vitest';

// Mock OpenAI client
const mockCallStreaming = vi.fn();

beforeEach(() => {
	// Reset all mocks
	vi.clearAllMocks();

	// Mock the client
	// Ensure llmClient is defined before mocking
	OttagaHealthLLM.llmProviderInstance.callStreaming = mockCallStreaming;
});

it('Should stream with the correct data', async () => {
	mockCallStreaming.mockImplementation(async function* () {
		yield { success: true, data: 'This ' };
		yield { success: true, data: 'is ' };
		yield { success: true, data: 'a ' };
		yield { success: true, data: 'test.' };
	});

	const newMessage: ChatMessage = { role: 'user', content: 'Hi there' };
	const OttagaHealthResponse = OttagaHealthLLM.SendMessage([newMessage]);

	let resultMessage = '';
	for await (const messageChunk of OttagaHealthResponse) {
		if (messageChunk.success) {
			expect(messageChunk.success).toBeTruthy();
			expect(messageChunk.data).toBeDefined();
			resultMessage += messageChunk.data;
		}
	}

	expect(resultMessage).toBe('This is a test.');
});

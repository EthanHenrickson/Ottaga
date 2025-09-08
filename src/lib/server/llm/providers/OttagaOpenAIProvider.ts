import type { CompletionResponse, LLMConfig, ChatMessage, StreamingResponse } from '$lib/types';
import OpenAI from 'openai';
import { OttagaAbstractBaseProvider } from './OttagaAbstractBaseProvider';

export class OttagaOpenAIProvider extends OttagaAbstractBaseProvider {
	protected client: OpenAI;

	constructor(llmConfig: LLMConfig) {
		super(llmConfig);

		this.client = new OpenAI({
			baseURL: llmConfig.baseUrl,
			apiKey: llmConfig.apiKey
		});
	}

	/**
	 * Calls the OpenAI chat completion API without streaming.
	 *
	 * @param messages Array of message objects representing the conversation history
	 * @returns Promise resolving to completion response object
	 */
	async callCompletion(
		messages: ChatMessage[],
		showReasoningTokens = false
	): Promise<CompletionResponse<string>> {
		const apiMessageArray = [
			{ role: 'system', content: this.systemPrompt },
			...messages
		] as ChatMessage[];

		const apiResponse = await this.client.chat.completions.create({
			model: this.model,
			temperature: this.temperature,
			max_tokens: this.maxTokens,
			messages: apiMessageArray,
			stream: false
		});

		let messageContent = apiResponse.choices[0].message.content;

		if (messageContent) {
			if (!showReasoningTokens && messageContent.includes('</think>')) {
				messageContent = messageContent.slice(messageContent.indexOf('</think>') + 8);
			}
			return {
				success: true,
				data: messageContent
			};
		} else {
			return { success: false };
		}
	}

	/**
	 * Calls the OpenAI chat completion API with streaming enabled.
	 * Returns an async generator that yields streaming response chunks.
	 *
	 * @param messages Array of message objects representing the conversation history
	 * @yields Streaming response objects containing either success with partial completion data or failure indication
	 * @returns Async generator for streaming responses
	 */
	async *callStreaming(
		messages: ChatMessage[],
		showReasoningTokens = false
	): AsyncGenerator<StreamingResponse<string>> {
		let isReasoning = false;
		const apiMessageArray = [
			{ role: 'system', content: this.systemPrompt },
			...messages
		] as ChatMessage[];

		const apiResponse = await this.client.chat.completions.create({
			model: this.model,
			temperature: this.temperature,
			max_tokens: this.maxTokens,
			messages: apiMessageArray,
			stream: true
		});

		const reader = apiResponse.toReadableStream().getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			//Decode reader stream and extract data out of it. Then yield (return for async generator) it
			const chunk = decoder.decode(value);
			const dataChunk = this.extractChunk(chunk);

			if (!showReasoningTokens) {
				//Skip sending over thinking tokens
				if (dataChunk == '<think>') {
					isReasoning = true;
				} else if (dataChunk == '</think>') {
					isReasoning = false;
					continue;
				}

				if (isReasoning) continue;
			}

			if (dataChunk) {
				yield {
					success: true,
					data: dataChunk
				};
			} else {
				yield {
					success: false
				};
			}
		}
	}

	/**
	 * Takes in an OpenAI streaming chunk and returns the message content
	 * @param chunk OpenAI streaming chunk to be processed
	 * @returns Chunk data or null if no content available
	 */
	private extractChunk(chunk: string): string | null {
		const data = JSON.parse(chunk) as OpenAI.ChatCompletionChunk;

		if (data.choices[0]) {
			if (data.choices[0].finish_reason == null) {
				return data.choices[0].delta.content as string;
			}
		}
		return null;
	}
}

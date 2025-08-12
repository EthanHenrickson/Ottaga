import type { CompletionResponse, LLMConfig, ChatMessage, StreamingResponse } from '$lib/types';

export class OttagaAbstractBaseProvider {
	protected systemPrompt: string;
	protected model: string;
	protected temperature: number;
	protected maxTokens: number;

	constructor(llmConfig: LLMConfig) {
		this.systemPrompt = llmConfig.systemPrompt;
		this.model = llmConfig.model;
		this.temperature = llmConfig.temperature;
		this.maxTokens = llmConfig.maxTokens;
	}

	/**
	 * Abstract method for synchronous completion requests.
	 * Must be implemented by concrete subclasses.
	 * @param {ChatMessage[]} messages - Array of message objects for context
	 * @returns {Promise<CompletionResponse<string>>} Promise resolving to completion response
	 * @throws {Error} When not implemented
	 */
	callCompletion(
		messages: ChatMessage[],
		showReasoningTokens = false
	): Promise<CompletionResponse<string>> {
		throw new Error('Not implemented');
	}

	/**
	 * Abstract method for streaming completion requests.
	 * Must be implemented by concrete subclasses.
	 * @param {ChatMessage[]} messages - Array of message objects for context
	 * @returns {AsyncGenerator<StreamingResponse<string>>} Async generator yielding streaming response chunks
	 * @throws {Error} When not implemented
	 */
	callStreaming(
		messages: ChatMessage[],
		showReasoningTokens = false
	): AsyncGenerator<StreamingResponse<string>> {
		throw new Error('Not implemented');
	}

	/**
	 * Gets the system prompt configured for this provider instance.
	 * @returns {string} The system prompt string
	 */
	get SystemPrompt(): string {
		return this.systemPrompt;
	}

	/**
	 * Gets the model configured for this provider instance.
	 * @returns {string} The model string
	 */
	get Model(): string {
		return this.model;
	}

	/**
	 * Gets the temperature configured for this provider instance.
	 * @returns {number} The temperature value
	 */
	get Temperature(): number {
		return this.temperature;
	}

	/**
	 * Gets the max number of tokens configured for this provider instance.
	 * @returns {number} The max token value
	 */
	get MaxTokens(): number {
		return this.maxTokens;
	}
}

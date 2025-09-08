import type { CompletionResponse, LLMConfig, ChatMessage, StreamingResponse } from '$lib/types';

/**
 * Abstract base class for LLM providers that defines the common interface and configuration
 */
export class OttagaAbstractBaseProvider {
	protected systemPrompt: string;
	protected model: string;
	protected temperature: number;
	protected maxTokens: number;

	/**
	 * Creates a new OttagaAbstractBaseProvider instance
	 * @param llmConfig - Configuration object containing LLM settings
	 */
	constructor(llmConfig: LLMConfig) {
		this.systemPrompt = llmConfig.systemPrompt;
		this.model = llmConfig.model;
		this.temperature = llmConfig.temperature;
		this.maxTokens = llmConfig.maxTokens;
	}

	/**
	 * Abstract method for synchronous completion requests.
	 * Must be implemented by concrete subclasses.
	 * @param messages - Array of message objects for context
	 * @param showReasoningTokens - Whether to include reasoning tokens in response
	 * @returns Promise resolving to completion response
	 * @throws Error when not implemented
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
	 * @param messages - Array of message objects for context
	 * @param showReasoningTokens - Whether to include reasoning tokens in response
	 * @returns Async generator yielding streaming response chunks
	 * @throws Error when not implemented
	 */
	callStreaming(
		messages: ChatMessage[],
		showReasoningTokens = false
	): AsyncGenerator<StreamingResponse<string>> {
		throw new Error('Not implemented');
	}

	/**
	 * Gets the system prompt configured for this provider instance
	 * @returns The system prompt string
	 */
	get SystemPrompt(): string {
		return this.systemPrompt;
	}

	/**
	 * Gets the model configured for this provider instance
	 * @returns The model string
	 */
	get Model(): string {
		return this.model;
	}

	/**
	 * Gets the temperature configured for this provider instance
	 * @returns The temperature value
	 */
	get Temperature(): number {
		return this.temperature;
	}

	/**
	 * Gets the max number of tokens configured for this provider instance
	 * @returns The max token value
	 */
	get MaxTokens(): number {
		return this.maxTokens;
	}
}

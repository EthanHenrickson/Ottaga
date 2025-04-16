import { TOGETHER_API_KEY } from '$env/static/private';
import OpenAI from "openai";

import type { LLMConfig } from "$lib/types";

/**
 * Abstract base class for LLM implementations providing common configuration
 * and client setup for interacting with the Together API.
 * 
 * Contains core functionality shared by all LLM implementations in the system.
 */
export abstract class BaseLLM {
    /** OpenAI client instance configured for Together API */
    protected Client: OpenAI;
    /** System prompt used for all conversations */
    protected SystemPrompt: string;
    /** Model identifier for the LLM */
    protected Model: string;
    /** Temperature setting for response generation */
    protected Temperature: number;
    /** Maximum tokens allowed in responses */
    protected MaxTokens: number;

    /**
     * Initializes a new BaseLLM instance with the provided configuration
     * @param {LLMConfig} config - Configuration object containing:
     *   - systemPrompt: string - The initial system prompt
     *   - model: string - The model identifier
     *   - temperature: number - Creativity/randomness setting (0-2)
     *   - maxTokens: number - Maximum response length
     */
    constructor(config: LLMConfig) {
        this.Client = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        });

        this.SystemPrompt = config.systemPrompt;
        this.Model = config.model;
        this.Temperature = config.temperature;
        this.MaxTokens = config.maxTokens;
    }
}

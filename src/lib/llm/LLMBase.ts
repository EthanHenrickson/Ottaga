import { TOGETHER_API_KEY } from '$env/static/private';
import OpenAI from "openai";

import type { LLMConfig } from "$lib/types";

export abstract class BaseLLM {
    protected Client: OpenAI;
    protected SystemPrompt: string;
    protected Model: string;
    protected Temperature: number;
    protected MaxTokens: number;

    /**
     * Creates a new LLMClient instance.
     * @param config - The LLM config 
     */
    constructor(config: LLMConfig) {
        this.Client = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        }),

            this.SystemPrompt = config.systemPrompt,
            this.Model = config.model,
            this.Temperature = config.temperature,
            this.MaxTokens = config.maxTokens
    }
}
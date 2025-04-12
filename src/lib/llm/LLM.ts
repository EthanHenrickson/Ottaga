import { TOGETHER_API_KEY } from '$env/static/private';
import OpenAI from "openai";

import type { LLMConfig, Message } from "$lib/types";

export abstract class BaseLLM {
    protected Client: OpenAI;
    protected SystemPrompt: string;
    protected Model: string;
    protected Temperature: number;
    protected MaxTokens: number;

    /**
     * Creates a new LLMClient instance.
     * @param LLMConfig - The LLM config 
     */
    constructor(LLMConfig: LLMConfig) {
        this.Client = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        }),

            this.SystemPrompt = LLMConfig.systemPrompt,
            this.Model = LLMConfig.model,
            this.Temperature = LLMConfig.temperature,
            this.MaxTokens = LLMConfig.maxTokens
    }

    protected get SystemPromptAsMessage(): Message {
        return {
            role: "system",
            content: this.SystemPrompt
        }
    }
}
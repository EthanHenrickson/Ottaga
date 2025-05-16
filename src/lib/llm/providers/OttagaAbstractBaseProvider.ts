import type { CompletionResponse, LLMConfig, Message, StreamingResponse } from "$lib/types";

export class OttagaAbstractBaseProvider {
    systemPrompt: string;
    model: string;
    temperature: number;
    maxTokens: number;

    constructor(llmConfig: LLMConfig) {
        this.systemPrompt = llmConfig.systemPrompt;
        this.model = llmConfig.model;
        this.temperature = llmConfig.temperature;
        this.maxTokens = llmConfig.maxTokens;
    }

    callCompletion(message: Message[]): Promise<CompletionResponse<string>> {
        throw new Error("Not implemented");
    }
    callStreaming(message: Message[]): AsyncGenerator<StreamingResponse<string>> {
        throw new Error("Not implemented");
    }

    get SystemPrompt() {
        return this.systemPrompt;
    }

    get Model() {
        return this.model;
    }

    get Temperature() {
        return this.temperature;
    }

    get MaxTokens() {
        return this.maxTokens;
    }

}

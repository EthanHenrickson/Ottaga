import type { CompletionResponse, LLMConfig, Message, StreamingResponse } from "$lib/types";

export class OttagaAbstractBaseProvider {
    protected llmConfig: LLMConfig

    constructor(llmConfig: LLMConfig) {
        this.llmConfig = llmConfig;
    }

    callCompletion(message: Message[], showReasoningTokens = false): Promise<CompletionResponse<string>> {
        throw new Error("Not implemented");
    }
    callStreaming(message: Message[], showReasoningTokens = false): AsyncGenerator<StreamingResponse<string>> {
        throw new Error("Not implemented");
    }

    get SystemPrompt() {
        return this.llmConfig.systemPrompt;
    }

    get Model() {
        return this.llmConfig.model;
    }

    get Temperature() {
        return this.llmConfig.temperature;
    }

    get MaxTokens() {
        return this.llmConfig.maxTokens;
    }

}

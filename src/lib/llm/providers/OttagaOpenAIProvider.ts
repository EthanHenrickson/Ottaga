import type { CompletionResponse, LLMConfig, Message, StreamingResponse } from "$lib/types";
import OpenAI from "openai";
import { OttagaAbstractBaseProvider } from "./OttagaAbstractBaseProvider";

export class OttagaOpenAIProvider extends OttagaAbstractBaseProvider {
    protected client: OpenAI

    constructor(llmConfig: LLMConfig) {
        super(llmConfig);

        this.client = new OpenAI({
            baseURL: llmConfig.baseUrl,
            apiKey: llmConfig.apiKey,
        });
    }

    async callCompletion(messages: Message[]): Promise<CompletionResponse<string>> {
        const apiResponse = await this.client.chat.completions.create({
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            messages: messages,
            stream: false
        })

        if (apiResponse.choices.length != 0) {

            return {
                success: true,
                data: apiResponse.choices[0].message.content || ""
            }
        } else {
            return { success: false }
        }

    }

    async *callStreaming(messages: Message[]): AsyncGenerator<StreamingResponse<string>> {
        let apiMessageArray = [{ role: "system", content: this.systemPrompt }, ...messages] as Message[]

        const apiResponse = await this.client.chat.completions.create({
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            messages: apiMessageArray,
            stream: true
        })

        const reader = apiResponse.toReadableStream().getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) break;

            let chunk = decoder.decode(value);
            let dataChunk = this.extractChunk(chunk)

            if (dataChunk != undefined) {
                yield {
                    success: true,
                    data: dataChunk
                }
            } else {
                yield {
                    success: false,
                }
            }
        }
    }

    private extractChunk(chunk: string) {
        const data = JSON.parse(chunk) as OpenAI.ChatCompletionChunk

        if (data.object == "chat.completion.chunk" && data.choices[0]) {
            if (data.choices[0].finish_reason == null) {
                return data.choices[0].delta.content as string
            }
        }
        return null;
    }
}

import type { CompletionResponse, LLMConfig, Message, StreamingResponse } from "$lib/types";
import OpenAI from "openai";
import { OttagaAbstractBaseProvider } from "./OttagaAbstractBaseProvider";
import { tick } from "svelte";

export class OttagaOpenAIProvider extends OttagaAbstractBaseProvider {
    protected client: OpenAI

    constructor(llmConfig: LLMConfig) {
        super(llmConfig);

        this.client = new OpenAI({
            baseURL: llmConfig.baseUrl,
            apiKey: llmConfig.apiKey,
        });
    }

    async callCompletion(messages: Message[], showReasoningTokens = false): Promise<CompletionResponse<string>> {
        const apiResponse = await this.client.chat.completions.create({
            model: this.Model,
            temperature: this.Temperature,
            max_tokens: this.MaxTokens,
            messages: messages,
            stream: false
        })

        let messageContent = apiResponse.choices[0].message.content

        if (messageContent) {
            if (!showReasoningTokens && messageContent.includes("</think>")) {
                messageContent =  messageContent.slice(messageContent.indexOf("</think>") + 8)
            }
            return {
                success: true,
                data: messageContent
            }
        } else {
            return { success: false }
        }

    }

    async *callStreaming(messages: Message[], showReasoningTokens = false): AsyncGenerator<StreamingResponse<string>> {
        let isReasoning = false
        let apiMessageArray = [{ role: "system", content: this.SystemPrompt }, ...messages] as Message[]

        const apiResponse = await this.client.chat.completions.create({
            model: this.Model,
            temperature: this.Temperature,
            max_tokens: this.MaxTokens,
            messages: apiMessageArray,
            stream: true,
        })

        const reader = apiResponse.toReadableStream().getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) break;

            let chunk = decoder.decode(value);
            let dataChunk = this.extractChunk(chunk)

            if (!showReasoningTokens) {
                //Skip sending over thinking tokens
                if (dataChunk == "<think>") {
                    isReasoning = true
                } else if (dataChunk == "</think>") {
                    isReasoning = false
                }

                if (isReasoning) continue;
            }


            if (dataChunk) {
                yield {
                    success: true,
                    data: dataChunk,
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

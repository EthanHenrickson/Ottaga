import type { CompletionResponse, LLMConfig, ChatMessage, StreamingResponse } from "$lib/types";
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

    /**
     * Calls the OpenAI chat completion API without streaming.
     *
     * @param {ChatMessage[]} messages - Array of message objects representing the conversation history
     * @returns {Promise<CompletionResponse<string>>} Promise resolving to completion response object
     */
    async callCompletion(messages: ChatMessage[], showReasoningTokens = false): Promise<CompletionResponse<string>> {
        let apiMessageArray = [{ role: "system", content: this.systemPrompt }, ...messages] as ChatMessage[]

        const apiResponse = await this.client.chat.completions.create({
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            messages: apiMessageArray,
            stream: false
        })

        let messageContent = apiResponse.choices[0].message.content

        if (messageContent) {
            if (!showReasoningTokens && messageContent.includes("</think>")) {
                messageContent = messageContent.slice(messageContent.indexOf("</think>") + 8)
            }
            return {
                success: true,
                data: messageContent
            }
        } else {
            return { success: false }
        }

    }

    /**
     * Calls the OpenAI chat completion API with streaming enabled.
     * Returns an async generator that yields streaming response chunks.
     *
     * @param {ChatMessage[]} messages - Array of message objects representing the conversation history
     * @yields {StreamingResponse<string>} Yields streaming response objects containing either:
     *   - Success with partial completion data (string)
     *   - Failure indication when no valid chunk is available
     * @returns {AsyncGenerator<StreamingResponse<string>>} Async generator for streaming responses
     */
    async *callStreaming(messages: ChatMessage[], showReasoningTokens = false): AsyncGenerator<StreamingResponse<string>> {
        let isReasoning = false
        let apiMessageArray = [{ role: "system", content: this.systemPrompt }, ...messages] as ChatMessage[]

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

            //Decode reader stream and extract data out of it. Then yield (return for async generator) it
            let chunk = decoder.decode(value);
            let dataChunk = this.extractChunk(chunk)

            if (!showReasoningTokens) {
                //Skip sending over thinking tokens
                if (dataChunk == "<think>") {
                    isReasoning = true
                } else if (dataChunk == "</think>") {
                    isReasoning = false
                    continue
                }

                if (isReasoning) continue;
            }

            if (dataChunk) {
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

    /**
     * Takes in an Open AI Streaming Chunk and returns the message content
     * @param {string} chunk OpenAI Streaming Chunk to be processed
     * @returns {string | null} Chunk data
     */
    private extractChunk(chunk: string): string | null {
        const data = JSON.parse(chunk) as OpenAI.ChatCompletionChunk

        if (data.choices[0]) {
            if (data.choices[0].finish_reason == null) {
                return data.choices[0].delta.content as string
            }
        }
        return null;
    }
}

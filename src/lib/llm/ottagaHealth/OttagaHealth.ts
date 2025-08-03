import type { ChatMessage, StreamingResponse } from "$lib/types";
import type { OttagaAbstractBaseProvider } from '../providers/OttagaAbstractBaseProvider';

/**
 * A client for interacting with language learning models through the OpenAI API.
 * This class provides functionality to generate system prompts and send messages
 * to the LLM using OpenAI's chat completions API.
 */
export class OttagaHealth {
    llmProviderInstance: OttagaAbstractBaseProvider;

    constructor(llmInstance: OttagaAbstractBaseProvider) {
        this.llmProviderInstance = llmInstance;
    }

    /**
     * Sends a series of messages to the LLM and returns the model's response.
     * @param pastMessages - Array of previous Message objects in the conversation
     * @param newMessage - The new message to be processed
     * @returns A Promise resolving to an object containing the model's response as a Message
     * @throws Error if the model's response is undefined
     */
    async *SendMessage(messages: ChatMessage[]): AsyncGenerator<StreamingResponse<string>> {
        //Get LLM response message
        const chatResponse = this.llmProviderInstance.callStreaming(messages)

        for await (const chunk of chatResponse) {
            if (chunk.success === true) {
                yield {
                    success: true,
                    data: chunk.data
                }
            }
        }

    }
}

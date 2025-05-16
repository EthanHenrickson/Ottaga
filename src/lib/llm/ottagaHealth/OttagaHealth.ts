import { ChatDatabase } from '$lib/db/chat';

import type { Message, StreamingResponse } from "$lib/types";
import type { OttagaAbstractBaseProvider } from '../providers/OttagaAbstractBaseProvider';

/**
 * A client for interacting with language learning models through the OpenAI API.
 * This class provides functionality to generate system prompts and send messages
 * to the LLM using OpenAI's chat completions API.
 */
export class OttagaHealth {
    llmInstance: OttagaAbstractBaseProvider;

    constructor(llmInstance: OttagaAbstractBaseProvider) {
        this.llmInstance = llmInstance;
    }

    get SystemPrompt() {
        return this.llmInstance.SystemPrompt
    }

    /**
     * Sends a series of messages to the LLM and returns the model's response.
     * @param pastMessages - Array of previous Message objects in the conversation
     * @param newMessage - The new message to be processed
     * @returns A Promise resolving to an object containing the model's response as a Message
     * @throws Error if the model's response is undefined
     */
    async *SendMessage(messages: Message[]): AsyncGenerator<StreamingResponse<string>> {
        //Get LLM response message
        const chatResponse = this.llmInstance.callStreaming(messages)

        for await (const chunk of chatResponse) {
            if(chunk.success === true){
                yield {
                    success: true,
                    data: chunk.data
                }
            }
        }

    }
}

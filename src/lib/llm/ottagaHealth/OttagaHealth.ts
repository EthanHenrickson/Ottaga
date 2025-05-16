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

    async CreateChat(userInfo?: { userID: string, pastSessionSummaries?: string[] }): Promise<{ chatID: string }> {
        //Create a chat with userID if provided
        let newChat = await ChatDatabase.createChat(userInfo?.userID)

        if (newChat.success) {
            //Generate system prompt
            const systemMessage = this.GenerateSystemPrompt(userInfo?.pastSessionSummaries)
            await ChatDatabase.addChatMessage(newChat.data.uuid, systemMessage)

            //Return chatID
            return { chatID: newChat.data.uuid }
        } else {
            throw Error("Failed to create Chat for Ottaga")
        }
    }

    /**
     * Generates a system prompt that includes past session summaries.
     * @param pastUserSessionSummaries - Array of previous session summaries to include in the prompt
     * @returns A Message object containing the generated system prompt
     */
    private GenerateSystemPrompt(pastUserSessionSummaries?: string[]): Message {
        //Return variable
        let returnMessage: Message = {
            role: "system",
            content: ""
        }

        return returnMessage
    }

    /**
     * Sends a series of messages to the LLM and returns the model's response.
     * @param pastMessages - Array of previous Message objects in the conversation
     * @param newMessage - The new message to be processed
     * @returns A Promise resolving to an object containing the model's response as a Message
     * @throws Error if the model's response is undefined
     */
    async *SendMessage(messages: Message[]): AsyncGenerator<StreamingResponse<string>> {
        const responseMessage: Message = {
            role: "assistant",
            content: ""
        }
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

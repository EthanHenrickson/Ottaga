import { OttagaConfig } from '../../../../llm.config'
import { BaseLLM } from '../LLMBase';
import { LLMHelper } from '../helper/LLMHelper'; 
import { ChatDatabase } from '$lib/db/chat';

import type { LLMConfig, Message } from "$lib/types";

/**
 * A client for interacting with language learning models through the OpenAI API.
 * This class provides functionality to generate system prompts and send messages
 * to the LLM using OpenAI's chat completions API.
 */
class OttagaLLM extends BaseLLM {

    /**
     * Creates a new LLMClient instance.
     * @param config - The LLM config that will be used for Ottaga
     */
    constructor(config: LLMConfig) {
        super(config)
    }

    /**
     * Creates a new chat session in the database.
     * Generates a system prompt and saves it to the database.
     * @param userInfo - Optional user information including ID and past session summaries
     * @returns The ID of the newly created chat session
     * @throws Error if chat creation fails
     */
    async CreateChat(userInfo?: { userID: string, pastSessionSummaries?: string[] }): Promise<string> {
        //Create a chat with userID if provided
        let newChat = await ChatDatabase.createChat(userInfo?.userID)

        if (newChat.success) {
            //Generate system prompt
            const systemMessage = this.GenerateSystemPrompt(userInfo?.pastSessionSummaries)
            await ChatDatabase.addChatMessage(newChat.data, systemMessage)

            //Return chatID
            return newChat.data
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

        if (pastUserSessionSummaries) {
            //Generate new prompt and append past user summaries to it
            let newPrompt = `${this.SystemPrompt} \n Here is a summary of the max last ${pastUserSessionSummaries.length} sessions. \n`

            pastUserSessionSummaries.forEach((summary, index) => {
                newPrompt += `<session ${index + 1}> ${summary} </session ${index + 1}>`
            })

            returnMessage.content = newPrompt

        } else {
            //Use basic system prompt
            returnMessage.content = this.SystemPrompt
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
    async SendMessage(pastMessages: Message[], newMessage: Message): Promise<{ data: Message }> {
        const userMessage = await LLMHelper.CheckUserMessage(newMessage)
        const messages = [...pastMessages, newMessage]

        //Default message
        const responseMessage: Message = {
            role: "assistant",
            content: ""
        }

        if (userMessage.isMalicious) {
            //Set response message 
            responseMessage.content = userMessage.messageResponse

            return {
                data: responseMessage
            }
        } else {
            //Get LLM response message
            let chatResponse = await this.Client.chat.completions.create({
                model: this.Model,
                temperature: this.Temperature,
                max_tokens: this.MaxTokens,
                messages: messages,
            });

            //Set response message 
            responseMessage.content = chatResponse.choices[0].message.content || ""

            return {
                data: responseMessage
            }
        }
    }
}

/** 
 * Instance of OttagaLLM configured for mental health assistance.
 * Uses the configuration specified in OttagaConfig.
 */
export let Ottaga = new OttagaLLM(OttagaConfig)

import { TOGETHER_API_KEY } from '$env/static/private';
import { OttagaConfig, OttagaAssistantConfig } from '../../../llm.config'
import OpenAI from "openai";

import type { LLMConfig, Message } from "$lib/types";
import { BaseLLM } from './LLM';
import { Helper } from './HelperLLM';

/**
 * A client for interacting with language learning models through the OpenAI API.
 * This class provides functionality to generate system prompts and send messages
 * to the LLM using OpenAI's chat completions API.
 */
class OttagaLLM extends BaseLLM {

    /**
     * Creates a new LLMClient instance.
     * @param OttagaConfig - The LLM config that will be used for Ottaga
     */
    constructor(OttagaConfig: LLMConfig,) {
        super(OttagaConfig)
    }

    /**
     * Generates a system prompt that includes past session summaries.
     * @param pastUserSessionSummaries - Array of previous session summaries to include in the prompt
     * @returns A Message object containing the generated system prompt
     */
    private async AppendSessionSummariesTooSystemPrompt(pastUserSessionSummaries: string[] = []): Promise<Message> {
        let returnPrompt = `
            ${this.SystemPrompt} \n
            Here is a summary of the max last ${pastUserSessionSummaries.length} sessions. \n`

        pastUserSessionSummaries.forEach((summary, index) => {
            returnPrompt += `<session ${index + 1}> ${summary} </session ${index + 1}>`
        })

        return {
            role: "system",
            content: returnPrompt
        }
    }

    /**
     * Sends a series of messages to the LLM and returns the model's response.
     * @param messages - Array of Message objects representing the conversation
     * @returns A Promise resolving to the model's response as a Message
     * @throws Error if the model's response is undefined
     */
    async SendMessage(pastMessages: Message[], newMessage: Message, pastUserSessionSummaries?: string[]): Promise<{ messageWasMalicious: boolean, data: Message }> {
        const isUserMessageMalicious = await Helper.isMessageMalicious(newMessage)
        const systemPrompt = pastUserSessionSummaries ? await this.AppendSessionSummariesTooSystemPrompt(pastUserSessionSummaries) : this.SystemPromptAsMessage
        const messages = [systemPrompt, ...pastMessages, newMessage]

        //Default message
        const responseMessage: Message = {
            role: "assistant",
            content: ""
        }

        if (isUserMessageMalicious) {
            //Set response message 
            responseMessage.content = "Please don't manipulate the LLM"

            return {
                messageWasMalicious: true,
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
                messageWasMalicious: false,
                data: responseMessage
            }
        }
    }
}

/** Instance of LLMClient configured for mental health assistance using Llama 70B model */
export let Ottaga = new OttagaLLM(OttagaConfig)
import { TOGETHER_API_KEY } from '$env/static/private';
import { OttagaConfig, OttagaAssistantConfig } from '../../../llm.config'
import OpenAI from "openai";

import type { LLMConfig, Message } from "$lib/types";

class BaseLLMClient {
    private baseClient: OpenAI;
    private baseSystemPrompt: string;
    private baseModel: string;
    private baseTemperature: number;
    private baseMaxTokens: number;

    /**
     * Creates a new LLMClient instance.
     * @param LLMConfig - The LLM config 
     */
    constructor(LLMConfig: LLMConfig) {
        this.baseClient = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        }),

        this.baseSystemPrompt = LLMConfig.systemPromptMessage,
        this.baseModel = LLMConfig.model,
        this.baseTemperature = LLMConfig.temperature,
        this.baseMaxTokens = LLMConfig.maxTokens
    }

    async CheckUserMessage(message: Message): Promise<boolean> {
        let messagesToSend = [{role: "system", content: this.baseSystemPrompt} as Message, message]

        let response = await this.baseClient.chat.completions.create({
            model: this.baseModel,
            temperature: this.baseTemperature,
            max_tokens: this.baseMaxTokens,
            messages: messagesToSend,
        })

        let checkResponse = response.choices[0].message.content

        if (checkResponse === null) {
            throw Error("Ottaga - No message was received from check user message")
        } else {
            if (checkResponse.toLowerCase() === "no") {
                return false
            } else {
                return true
            }
        }
    }
}

/**
 * A client for interacting with language learning models through the OpenAI API.
 * This class provides functionality to generate system prompts and send messages
 * to the LLM using OpenAI's chat completions API.
 */
class OttagaLLM extends BaseLLMClient {
    private client: OpenAI;
    private systemPromptMessage: string;
    private model: string;
    private temperature: number;
    private maxTokens: number;

    /**
     * Creates a new LLMClient instance.
     * @param OttagaConfig - The LLM config that will be used for Ottaga
     * @param BaseConfig - The LLM config that the base class uses. The base class checks message for being malicious. 
     */
    constructor(OttagaConfig: LLMConfig, BaseConfig: LLMConfig) {
        super(BaseConfig)

        this.client = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        }),

        this.model = OttagaConfig.model,
        this.systemPromptMessage = OttagaConfig.systemPromptMessage,
        this.temperature = OttagaConfig.temperature,
        this.maxTokens = OttagaConfig.maxTokens
    }

    /**
     * Generates a system prompt that includes past session summaries.
     * @param pastUserSessionSummaries - Array of previous session summaries to include in the prompt
     * @returns A Message object containing the generated system prompt
     */
    async AppendSessionSummariesTooSystemPrompt(pastUserSessionSummaries: string[] = []): Promise<Message> {
        let returnPrompt = `
            ${this.systemPromptMessage} \n
            Here is a summary of the max last ${pastUserSessionSummaries.length} sessions. \n`

        pastUserSessionSummaries.forEach((summary, index) => {
            returnPrompt += `
                <session ${index + 1}> \n
                    ${summary} \n
                </session ${index + 1}>`
        })

        return {
            role: "system",
            content: returnPrompt
        }
    }

    get systemPrompt(): Message {
        return {
            role: "system",
            content: this.systemPromptMessage
        }
    }

    /**
     * Sends a series of messages to the LLM and returns the model's response.
     * @param messages - Array of Message objects representing the conversation
     * @returns A Promise resolving to the model's response as a Message
     * @throws Error if the model's response is undefined
     */
    async Send(pastMessages: Message[], newMessage: Message): Promise<{result: boolean, data: Message}> {

        if(await this.CheckUserMessage(newMessage)){
            return {result: false, data: {role: "assistant", content: "Please don't manipulate the LLM"}}
        }

        let messages = [this.systemPrompt, ...pastMessages, newMessage]

        let response = await this.client.chat.completions.create({
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            messages: messages,
        })

        if (response.choices[0].message === undefined) {
            throw Error("Ottaga - No message was received")
        }

        let responseMessage: Message = {
            role: response.choices[0].message.role,
            content: response.choices[0].message.content || ""
        }

        return {result: true, data: responseMessage}
    }
}

/** Instance of LLMClient configured for mental health assistance using Llama 70B model */
export let Ottaga = new OttagaLLM(OttagaConfig, OttagaAssistantConfig)
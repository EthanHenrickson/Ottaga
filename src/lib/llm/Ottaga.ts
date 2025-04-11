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

    protected async isMessageMalicious(message: Message): Promise<boolean> {
        let messagesToSend = [{ role: "system", content: this.baseSystemPrompt } as Message, message]

        let response = await this.baseClient.chat.completions.create({
            model: this.baseModel,
            temperature: this.baseTemperature,
            max_tokens: this.baseMaxTokens,
            messages: messagesToSend,
        })

        let checkResponse = response.choices[0].message.content

        if (checkResponse?.toLowerCase() === "no") {
            return false
        } else {
            return true
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
    private systemPrompt: string;
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
            this.systemPrompt = OttagaConfig.systemPromptMessage,
            this.temperature = OttagaConfig.temperature,
            this.maxTokens = OttagaConfig.maxTokens
    }

    /**
     * Generates a system prompt that includes past session summaries.
     * @param pastUserSessionSummaries - Array of previous session summaries to include in the prompt
     * @returns A Message object containing the generated system prompt
     */
    private async AppendSessionSummariesTooSystemPrompt(pastUserSessionSummaries: string[] = []): Promise<Message> {
        let returnPrompt = `
            ${this.systemPrompt} \n
            Here is a summary of the max last ${pastUserSessionSummaries.length} sessions. \n`

        pastUserSessionSummaries.forEach((summary, index) => {
            returnPrompt += `<session ${index + 1}> ${summary} </session ${index + 1}>`
        })

        return {
            role: "system",
            content: returnPrompt
        }
    }

    private get SystemPromptMessage(): Message {
        return {
            role: "system",
            content: this.systemPrompt
        }
    }

    /**
     * Sends a series of messages to the LLM and returns the model's response.
     * @param messages - Array of Message objects representing the conversation
     * @returns A Promise resolving to the model's response as a Message
     * @throws Error if the model's response is undefined
     */
    async SendMessage(pastMessages: Message[], newMessage: Message, pastUserSessionSummaries?: string[]): Promise<{ messageWasMalicious: boolean, data: Message }> {
        const isUserMessageMalicious = await this.isMessageMalicious(newMessage)
        const systemPrompt = pastUserSessionSummaries ? await this.AppendSessionSummariesTooSystemPrompt(pastUserSessionSummaries) : this.SystemPromptMessage
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
            let chatResponse = await this.client.chat.completions.create({
                model: this.model,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
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
export let Ottaga = new OttagaLLM(OttagaConfig, OttagaAssistantConfig)
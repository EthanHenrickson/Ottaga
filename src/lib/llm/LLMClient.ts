import type { Message } from "$lib/types";
import { TOGETHER_API_KEY } from '$env/static/private';
import { MentalHealthAssistant, MaliciousMessageAssistant } from '../../../llm.config'

import OpenAI from "openai";

abstract class LLMClient {

}

/**
 * A client for interacting with language learning models through the OpenAI API.
 * This class provides functionality to generate system prompts and send messages
 * to the LLM using OpenAI's chat completions API.
 */
class MainLLM implements LLMClient {
    private client: OpenAI;
    private systemPrompt: string;
    private model: string;
    private temperature: number;
    private maxTokens: number;

    /**
     * Creates a new LLMClient instance.
     * @param model - The identifier of the LLM model to use
     * @param systemPrompt - The system prompt to provide context to the model
     * @param temperature - Controls randomness in the model's responses (0-1)
     * @param maxTokens - Maximum number of tokens in the model's response
     */
    constructor(model: string, systemPrompt: string, temperature: number = .8, maxTokens: number = 8000) {
        this.client = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        }),

            this.model = model,
            this.systemPrompt = systemPrompt,
            this.temperature = temperature,
            this.maxTokens = maxTokens
    }

    /**
     * Generates a system prompt that includes past session summaries.
     * @param pastUserSessionSummaries - Array of previous session summaries to include in the prompt
     * @returns A Message object containing the generated system prompt
     */
    async GenerateSystemPrompt(pastUserSessionSummaries: string[] = []): Promise<Message> {
        let returnPrompt = ` ${this.systemPrompt} \n
            Here is a summary of the max last ${pastUserSessionSummaries.length} sessions.\n`

        if (pastUserSessionSummaries.length > 0) {
            for (let i = 0; i < pastUserSessionSummaries.length; i++) {
                returnPrompt += `<session ${i}> \n
                ${pastUserSessionSummaries[i]} \n
            </session ${i}>`
            }
        }

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
    async Send(messages: Message[]): Promise<Message> {

        let response = await this.client.chat.completions.create({
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            messages: messages,
        })

        if (response.choices[0].message === undefined) {
            throw Error("Issue with LLMClient.Send")
        }

        let responseMessage: Message = {
            role: response.choices[0].message.role,
            content: response.choices[0].message.content || ""
        }

        return responseMessage
    }
}

class LLMMaliciousMessageChecker implements LLMClient {
    private client: OpenAI;
    private systemPrompt: Message;
    private model: string;
    private temperature: number;
    private maxTokens: number;

    /**
     * Creates a new LLMClient instance.
     * @param model - The identifier of the LLM model to use
     * @param systemPrompt - The system prompt to provide context to the model
     * @param temperature - Controls randomness in the model's responses (0-1)
     * @param maxTokens - Maximum number of tokens in the model's response
     */
    constructor(model: string, systemPrompt: string, temperature: number = .1, maxTokens: number = 40) {
        this.client = new OpenAI({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        }),

            this.model = model,
            this.systemPrompt = { role: "system", content: systemPrompt },
            this.temperature = temperature,
            this.maxTokens = maxTokens
    }

    /**
     * Sends a message to the LLM and returns the model's response to a message being malicious or not.
     * @param message - Message to check for malicious content
     * @returns A Promise resolving to a boolean
     * @throws Error if the model's response is undefined
     */
    async CheckMessage(message: Message): Promise<boolean> {
        let messagesToSend = [this.systemPrompt, message]

        let response = await this.client.chat.completions.create({
            model: this.model,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            messages: messagesToSend,
        })

        let checkResponse = response.choices[0].message.content

        console.log(checkResponse)

        if (checkResponse === null) {
            throw Error("Issue with LLMClient")
        } else {
            if (checkResponse.toLowerCase() === "no") {
                return false
            } else {
                return true
            }
        }
    }
}

/** Instance of LLMClient configured for mental health assistance using Llama 70B model */
export let OttagaLLM = new MainLLM(MentalHealthAssistant.model, MentalHealthAssistant.systemPrompt, MentalHealthAssistant.temperature, MentalHealthAssistant.maxTokens)
/** Instance of LLMClient configured for malicious message detection using Llama 11B model */
export let MaliciousMessageLLM = new LLMMaliciousMessageChecker(MaliciousMessageAssistant.model, MaliciousMessageAssistant.systemPrompt, MaliciousMessageAssistant.temperature, MaliciousMessageAssistant.maxTokens)

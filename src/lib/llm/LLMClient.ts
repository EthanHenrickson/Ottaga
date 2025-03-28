import type { Message } from "$lib/types";
import { TOGETHER_API_KEY } from '$env/static/private';
import Together from "together-ai";

import { MentalHealthAssistant, MaliciousMessageAssistant } from '../../../llmConfig'

class LLMClient {
    private client: Together;
    private systemPrompt: string;
    private model: string;
    private temperature: number;
    private maxTokens: number;

    constructor(model: string, systemPrompt: string, temperature: number = .8, maxTokens: number = 4000) {
        this.client = new Together({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: TOGETHER_API_KEY,
        })

        this.systemPrompt = systemPrompt,
            this.model = model,
            this.temperature = temperature,
            this.maxTokens = maxTokens
    }

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

export let Llama3_70 = new LLMClient(MentalHealthAssistant.model, MentalHealthAssistant.systemPrompt, MentalHealthAssistant.temperature, MentalHealthAssistant.maxTokens)
export let Llama3_11 = new LLMClient(MaliciousMessageAssistant.model, MentalHealthAssistant.systemPrompt, MaliciousMessageAssistant.temperature, MaliciousMessageAssistant.maxTokens)

import type { Message } from "$lib/types";
import Together from "together-ai";

import { MentalHealthAssistant, MaliciousMessageAssistant } from '../../../llmConfig'

class LLMClient {
    private client: Together;
    private model: string;
    private temperature: number;
    private maxTokens: number;

    constructor(model: string, temperature: number = .8, maxTokens: number = 4000) {
        this.client = new Together({
            baseURL: 'https://api.together.xyz/v1',
            apiKey: process.env.TOGETHER_API_KEY,
        })
        this.model = model,
        this.temperature = temperature,
        this.maxTokens = maxTokens
    }

    async Send(messages: Message[]): Promise<Message> {
        let response = await this.client.chat.completions.create({
            model: this.model,
            messages: messages,
        })

        if(response.choices[0].message === undefined){
            throw Error("Issue with LLMClient.Send")
        }

        return response.choices[0].message as Message
    }
}
 
export let Llama3_70 = new LLMClient(MentalHealthAssistant.model, MentalHealthAssistant.temperature, MentalHealthAssistant.maxTokens)
export let Llama3_11 = new LLMClient(MaliciousMessageAssistant.model, MaliciousMessageAssistant.temperature, MaliciousMessageAssistant.maxTokens)

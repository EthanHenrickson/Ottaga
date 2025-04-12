import type { Message, LLMConfig } from "$lib/types";
import { OttagaAssistantConfig } from "../../../llm.config";
import { BaseLLM } from "./LLMBase";

class HelperLLM extends BaseLLM {

    /**
     * Creates a new HelperLLM instance.
     * @param config - Configuration for the LLM including model, temperature, and token settings
     */
    constructor(config: LLMConfig) {
        super(config)
    }

    /**
     * Checks if a user message is attempting to manipulate the LLM.
     * Sends the message to a moderation model to evaluate for malicious intent.
     * @param message - The message to be checked for malicious content
     * @returns Object indicating if message is malicious and optional response message
     */
    async CheckUserMessage(message: Message): Promise<{ isMalicious: true, messageResponse: string } | { isMalicious: false }> {
        const systemPrompt: Message = { role: "system", content: this.SystemPrompt }
        const messagesToSend = [systemPrompt, message]

        let response = await this.Client.chat.completions.create({
            model: this.Model,
            temperature: this.Temperature,
            max_tokens: this.MaxTokens,
            messages: messagesToSend,
        })

        let checkResponse = response.choices[0].message.content || ""

        if (checkResponse.toLowerCase() === "no") {
            return { isMalicious: false }
        } else {
            return { isMalicious: true, messageResponse: checkResponse }
        }
    }
}

export const LLMHelper = new HelperLLM(OttagaAssistantConfig)

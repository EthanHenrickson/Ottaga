import type { Message, LLMConfig } from "$lib/types";
import { OttagaAssistantConfig } from "../../../llm.config";
import { BaseLLM } from "./LLM";

class HelperLLM extends BaseLLM {

    /**
     * Creates a new LLMClient instance.
     * @param LLMConfig - The LLM config 
     */
    constructor(LLMConfig: LLMConfig) {
        super(LLMConfig)
    }

    /**
     * Checks if a user message is manipulating the LLM
     * @param message The message to be checked for being malicious
     * @returns boolean
     */
    async isMessageMalicious(message: Message): Promise<boolean> {
        let messagesToSend = [{ role: "system", content: this.SystemPrompt } as Message, message]

        let response = await this.Client.chat.completions.create({
            model: this.Model,
            temperature: this.Temperature,
            max_tokens: this.MaxTokens,
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

export const Helper = new HelperLLM(OttagaAssistantConfig)
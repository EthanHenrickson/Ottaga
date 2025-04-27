import type { Message, LLMConfig, MaliciousLLMResponse } from "$lib/types";
import { OttagaAssistantConfig } from "../../../../llm.config";
import { BaseLLM } from "../LLMBase";
import Analytics from "$lib/utility/ServerAnalytics";

/**
 * Specialized LLM implementation for handling moderation and safety checks
 * 
 * Extends BaseLLM to provide additional functionality for detecting and handling
 * potentially malicious user messages before they reach the main assistant.
 * @extends BaseLLM
 */
export class HelperLLM extends BaseLLM {

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
     * 
     * @param {Message} message - The message to check, containing role and content
     * @returns {Promise<MaliciousLLMResponse>} Object containing:
     *   - isMalicious: boolean indicating if message was flagged
     *   - messageResponse: string response to send if malicious (optional)
     * @throws May throw errors from the underlying LLM API call
     */
    async CheckUserMessage(message: Message): Promise<MaliciousLLMResponse> {
        const systemPrompt: Message = { role: "system", content: this.SystemPrompt }
        const messagesToSend = [systemPrompt, message]
        let returnResponse: MaliciousLLMResponse = { isMalicious: true, messageResponse: "Sorry that message couldn't be parsed. Please try again." }

        let response = await this.Client.chat.completions.create({
            model: this.Model,
            temperature: this.Temperature,
            max_tokens: this.MaxTokens,
            messages: messagesToSend,
        })

        let LLMResponse = response.choices[0].message.content || ""

        try {
            let ParseLLMResponse: any = JSON.parse(LLMResponse)

            if (typeof ParseLLMResponse.isMalicious === "boolean" && typeof ParseLLMResponse.messageResponse === "string") {
                returnResponse = ParseLLMResponse
            }
        } catch {
            console.log("Failed to parse json output - ", LLMResponse)
            Analytics.captureException("Failed to parse LLM response in Malicious message checker", "Anon", {message: message} )
        }

        return returnResponse
    }
}

export const LLMHelper = new HelperLLM(OttagaAssistantConfig)

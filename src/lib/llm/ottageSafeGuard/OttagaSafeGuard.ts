import type { Message, MaliciousLLMResponse } from "$lib/types";
import Analytics from "$lib/utility/ServerAnalytics";
import { OttagaAbstractBaseProvider } from "../providers/OttagaAbstractBaseProvider";

export class OttagaSafeGuard {
    llmInstance: OttagaAbstractBaseProvider;

    constructor(llmInstance: OttagaAbstractBaseProvider) {
        this.llmInstance = llmInstance;
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
        let returnResponse: MaliciousLLMResponse = { isMalicious: true, messageResponse: "Sorry that message couldn't be parsed. Please try again." }

        let response = await this.llmInstance.callCompletion([{ role: "system", content: this.llmInstance.SystemPrompt }, message] as Message[])

        if (response === null || response.success === false) {
            Analytics.captureException("User attempted to send malicious message", "Anon", { message: message })
            return returnResponse
        }

        try {
            let ParseLLMResponse: any = JSON.parse(response.data)

            if (typeof ParseLLMResponse.isMalicious === "boolean" && typeof ParseLLMResponse.messageResponse === "string") {
                returnResponse = ParseLLMResponse
            }
        } catch {
            console.log("Failed to parse json output - ", response)
            Analytics.captureException("Failed to parse LLM response in Malicious message checker", "Anon", { message: message })
        }

        return returnResponse
    }
}

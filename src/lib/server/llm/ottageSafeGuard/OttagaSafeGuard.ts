import type { ChatMessage, MaliciousLLMResponse } from '$lib/types';
import PostHogAnalytics from '$lib/server/utility/analytics/ServerAnalytics';
import { OttagaAbstractBaseProvider } from '../providers/OttagaAbstractBaseProvider';

export class OttagaSafeGuard {
	llmProviderInstance: OttagaAbstractBaseProvider;

	constructor(llmInstance: OttagaAbstractBaseProvider) {
		this.llmProviderInstance = llmInstance;
	}

	/**
	 * Checks if a user message is attempting to manipulate the LLM.
	 * Sends the message to a moderation model to evaluate for malicious intent.
	 *
	 * @param {ChatMessage} message - The message to check, containing role and content
	 * @returns {Promise<MaliciousLLMResponse>} Object containing:
	 *   - isMalicious: boolean indicating if message was flagged
	 *   - messageResponse: string response to send if malicious (optional)
	 * @throws May throw errors from the underlying LLM API call
	 */
	async CheckUserMessage(message: ChatMessage): Promise<MaliciousLLMResponse> {
		let returnResponse: MaliciousLLMResponse = {
			isMalicious: true,
			messageResponse: "Sorry that message couldn't be parsed. Please try again."
		};

		const response = await this.llmProviderInstance.callCompletion([message]);

		//If response failed; return default message and log to analytics
		if (!response || !response.success) {
			PostHogAnalytics.captureException('Call to LLM provider for malicious message failed', 'Anon', {
				message: message,
				responseFromLLM: response
			});
			return returnResponse;
		}

		try {
			const ParseLLMResponse: MaliciousLLMResponse = JSON.parse(response.data);

			if (
				typeof ParseLLMResponse.isMalicious === 'boolean' &&
				typeof ParseLLMResponse.messageResponse === 'string'
			) {
				returnResponse = ParseLLMResponse;

				if (ParseLLMResponse.isMalicious) {
					PostHogAnalytics.capture({
						distinctId: 'Anon',
						event: 'User attempted to send malicious message',
						properties: { message: message }
					});
				}
			}
		} catch {
			console.log('Failed to parse json output - ', response);
			PostHogAnalytics.captureException(
				'Failed to parse LLM response in Malicious message checker',
				'Anon',
				{ message: message }
			);
		}

		return returnResponse;
	}
}

import { OttagaHealthLLM, OttagaSafeGuardLLM } from '$lib/server/llm/Ottaga';
import { json, type RequestHandler } from '@sveltejs/kit';

import type { ChatMessage } from '$lib/types';
import PostHogAnalytics from '$lib/server/utility/analytics/ServerAnalytics';
import { EncodeToSSE } from '$lib/client/utility/SSE/SSEHelper';
import { ChatServiceSingleton } from '$lib/server/Services/ChatService';
import { CreateMessageDTO } from '$lib/client/DTOs/Message';
import { LLMGuestCallRateLimiterSingleton } from '$lib/server/utility/security/rateLimiter';

export const POST: RequestHandler = async ({ request }) => {
	//Get data from the request
	const data = await request.json();
	const chatID = data.chatID;
	const newMessage: ChatMessage = {
		role: 'user',
		content: data.messageInput
	};

	const isNotRateLimited = LLMGuestCallRateLimiterSingleton.isAllowed(chatID);
	if (!isNotRateLimited) {
		return json(
			{ success: false, message: `LLM Call Rate Limit Exceeded. Please wait and try again later.` },
			{ status: 429 }
		);
	}

	//Retrieve all previous messages and add them too the conversation
	const databaseResponse = await ChatServiceSingleton.GetChatMessagesByID(null, chatID);
	if (!databaseResponse.success || !databaseResponse.data) {
		throw Error('Failed to retrieve past messages');
	}

	const previousMessages: ChatMessage[] = databaseResponse.data.messages.map((element) =>
		element.ToChatMessage()
	);

	const stream = new ReadableStream({
		async start(controller) {
			try {
				const maliciousCheck = await OttagaSafeGuardLLM.CheckUserMessage(newMessage);
				if (maliciousCheck.isMalicious) {
					const responseMessage = EncodeToSSE(maliciousCheck.messageResponse);
					controller.enqueue(responseMessage);
					controller.close();

					PostHogAnalytics.capture({
						distinctId: 'Anon',
						event: 'message found too be malicious',
						properties: {
							maliciousMessage: newMessage
						}
					});

					return;
				}

				let FinalAssistantGeneratedResponse = '';
				const OttagaHealthResponseStream = OttagaHealthLLM.SendMessage([
					...previousMessages,
					newMessage
				]);

				for await (const streamChunk of OttagaHealthResponseStream) {
					if (streamChunk.success) {
						const sseData = EncodeToSSE(streamChunk.data);
						controller.enqueue(sseData);
						FinalAssistantGeneratedResponse += streamChunk.data;
					}
				}

				const UserMessageDTO = new CreateMessageDTO(chatID, newMessage.role, newMessage.content);
				ChatServiceSingleton.CreateChatMessage(null, UserMessageDTO);

				const AssistantMessageDTO = new CreateMessageDTO(
					chatID,
					'assistant',
					FinalAssistantGeneratedResponse
				);
				ChatServiceSingleton.CreateChatMessage(null, AssistantMessageDTO);

				controller.enqueue(EncodeToSSE('[DONE]'));
				controller.close();

				PostHogAnalytics.capture({ distinctId: 'Anon', event: 'guest llm api called' });
			} catch (error) {
				PostHogAnalytics.captureException({
					error: 'Failed to get Ottaga response',
					additionalProperties: { errorMessage: error }
				});

				console.error(error);
				controller.close();

				return json(
					{ success: false, message: `LLM API Server Error - ${error}` },
					{ status: 500 }
				);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream;',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};

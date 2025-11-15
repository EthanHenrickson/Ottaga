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
	const RequestData = await request.json();
	const ChatID = RequestData.chatID;
	const NewUserMessage: ChatMessage = {
		role: 'user',
		content: RequestData.messageInput
	};

	const isAllowed = LLMGuestCallRateLimiterSingleton.tryConsume(ChatID);
	if (!isAllowed) {
		return json(
			{ success: false, message: `LLM Call Rate Limit Exceeded. Please wait and try again later.` },
			{ status: 429 }
		);
	}

	//Retrieve all previous messages and add them too the conversation
	const ChatServiceDatabaseResponse = await ChatServiceSingleton.GetChatMessagesByID(null, ChatID);
	if (!ChatServiceDatabaseResponse.success || !ChatServiceDatabaseResponse.data) {
		throw Error('Failed to retrieve past messages');
	}

	const PreviousChatMessages: ChatMessage[] = ChatServiceDatabaseResponse.data.messages.map((element) =>
		element.ToChatMessage()
	);

	const stream = new ReadableStream({
		async start(controller) {
			try {
				const MaliciousMessageCheck = await OttagaSafeGuardLLM.CheckUserMessage(NewUserMessage);
				if (MaliciousMessageCheck.isMalicious) {
					const responseMessage = EncodeToSSE(MaliciousMessageCheck.messageResponse);
					controller.enqueue(responseMessage);
					controller.close();

					PostHogAnalytics.capture({
						distinctId: 'Anon',
						event: 'message found too be malicious',
						properties: {
							maliciousMessage: NewUserMessage
						}
					});

					return;
				}

				const OttagaHealthResponseStream = OttagaHealthLLM.SendMessage([
					...PreviousChatMessages,
					NewUserMessage
				]);
				
				let LLMGeneratedResponse = '';
				for await (const streamChunk of OttagaHealthResponseStream) {
					if (streamChunk.success) {
						const sseData = EncodeToSSE(streamChunk.data);
						controller.enqueue(sseData);
						LLMGeneratedResponse += streamChunk.data;
					}
				}

				const UserMessageDTO = new CreateMessageDTO(ChatID, NewUserMessage.role, NewUserMessage.content);
				ChatServiceSingleton.CreateChatMessage(null, UserMessageDTO);

				const AssistantMessageDTO = new CreateMessageDTO(
					ChatID,
					'assistant',
					LLMGeneratedResponse
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

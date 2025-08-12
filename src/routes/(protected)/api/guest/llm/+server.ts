import { OttagaHealthLLM, OttagaSafeGuardLLM } from '$lib/server/llm/Ottaga';
import { json, type RequestHandler } from '@sveltejs/kit';

import type { ChatMessage } from '$lib/types';
import Analytics from '$lib/utility/server/analytics/ServerAnalytics';
import { EncodeToSSE } from '$lib/utility/server/SSE/SSEHelper';
import { ChatServiceSingleton } from '$lib/server/Services/ChatService';
import { CreateMessageDTO } from '$lib/client/DTOs/Message';
import { LLMCallRateLimiterSingleton } from '$lib/utility/server/security/RateLimiter';

export const POST: RequestHandler = async ({ request }) => {
	//Get data from the request
	const data = await request.json();
	const chatID = data.chatID;
	const newMessage: ChatMessage = {
		role: 'user',
		content: data.messageInput
	};

	const isNotRateLimited = LLMCallRateLimiterSingleton.isAllowed(chatID);
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

	const databaseMessages = databaseResponse.data.messages;
	const previousMessages: ChatMessage[] = [];

	for (const item of databaseMessages) {
		previousMessages.push(item.ToChatMessage());
	}

	const stream = new ReadableStream({
		async start(controller) {
			try {
				const maliciousCheck = await OttagaSafeGuardLLM.CheckUserMessage(newMessage);
				if (maliciousCheck.isMalicious) {
					const responseMessage = EncodeToSSE(maliciousCheck.messageResponse);
					controller.enqueue(responseMessage);
				}

				let FinalAssistantGeneratedResponse = '';
				const OttagaHealthResponse = OttagaHealthLLM.SendMessage([...previousMessages, newMessage]);

				for await (const messageChunk of OttagaHealthResponse) {
					if (messageChunk.success) {
						const responseMessage = EncodeToSSE(messageChunk.data);
						controller.enqueue(responseMessage);
						FinalAssistantGeneratedResponse += messageChunk.data;
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

				Analytics.capture({ distinctId: 'Anon', event: 'api/llm called' });
			} catch (error) {
				Analytics.captureException({
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

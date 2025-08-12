import type { PageServerLoad } from './$types';
import { OttagaHealthLLM } from '$lib/server/llm/Ottaga';
import { ChatServiceSingleton } from '$lib/server/Services/ChatService';
import { CreateChatDTO } from '$lib/client/DTOs/Chat';
import { CreateMessageDTO } from '$lib/client/DTOs/Message';

export const load: PageServerLoad = async () => {
	const chatDBResponse = await ChatServiceSingleton.CreateChat(null, new CreateChatDTO());
	if (!chatDBResponse.success || !chatDBResponse.data) {
		throw Error('Failed to create Chat for Ottaga');
	}

	const systemMessage = OttagaHealthLLM.llmProviderInstance.SystemPrompt;
	const MessageDTO = new CreateMessageDTO(chatDBResponse.data.id, 'system', systemMessage);

	await ChatServiceSingleton.CreateChatMessage(null, MessageDTO);
	const chatID = chatDBResponse.data.id;

	return {
		chatID: chatID
	};
};

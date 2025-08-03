import type { PageServerLoad } from './$types';
import { OttagaHealthLLM } from '$lib/llm/Ottaga';
import { ChatServiceSingleton } from '$lib/server/Services/Implementations/ChatService';
import { CreateChatDTO } from '$lib/server/Services/DTOs/Chat';
import { CreateMessageDTO } from '$lib/server/Services/DTOs/Message';

export const load: PageServerLoad = async () => {
	//Create a new chat save the chat id
	let chatID: string;
	let chatDBResponse = await ChatServiceSingleton.CreateChat(null, new CreateChatDTO());

	if (chatDBResponse.success && chatDBResponse.data) {
		//Generate system prompt
		const systemMessage = OttagaHealthLLM.llmProviderInstance.SystemPrompt;
		await ChatServiceSingleton.CreateChatMessage(
			null,
			new CreateMessageDTO(chatDBResponse.data.id, 'system', systemMessage)
		);

		//Return chatID
		chatID = chatDBResponse.data.id;
	} else {
		throw Error('Failed to create Chat for Ottaga');
	}

	return {
		chatID: chatID
	};
};

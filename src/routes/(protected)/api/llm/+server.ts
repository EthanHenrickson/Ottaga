import { ChatDatabase } from '$lib/db/chat';
import { Llama3_70 } from '$lib/llm/LLMClient';
import { json, type RequestHandler } from '@sveltejs/kit';

import type { Message } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
    let allConversationMessages: Message[] = []

    const data = await request.json();

    //Get data from the request and save it to variables
    const chatID = data.chatID
    const newMessage: Message = {
        role: "user",
        content: data.messageInput
    }

    //Get the system message
    const systemMessage = await Llama3_70.GenerateSystemPrompt()
    allConversationMessages.push(systemMessage)

    //Retrieve all previous messages and add them too the conversation message
    const previousMessages = ChatDatabase.getChatMessages(chatID)
    if (previousMessages.success == true) {
        const messageData = previousMessages.data
        allConversationMessages = [...allConversationMessages, ...messageData]
    }
    
    allConversationMessages.push(newMessage)

    try {
        ChatDatabase.addChatMessage(chatID, newMessage)
        let response = await Llama3_70.Send(allConversationMessages)
        ChatDatabase.addChatMessage(chatID, response)
        return json({ success: true, message: "Data received", data: response }, { status: 200 })
    } catch (error) {
        console.error(error);
        return json({ success: false, message: `LLM API Server Error - ${error}` }, { status: 500 });
    }
};

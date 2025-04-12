import { ChatDatabase } from '$lib/db/chat';
import { Ottaga } from '$lib/llm/Ottaga';
import { json, type RequestHandler } from '@sveltejs/kit';

import type { Message } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
    let previousMessages: Message[] = []

    //Get data from the request and save it to variables
    const data = await request.json();
    const chatID = data.chatID
    const newMessage: Message = {
        role: "user",
        content: data.messageInput
    }

    //Retrieve all previous messages and add them too the conversation
    const databaseResponse = ChatDatabase.getChatMessages(chatID)
    if (databaseResponse.success) {
        previousMessages = [...databaseResponse.data]
    }

    try {
        let OttagaResponse = await Ottaga.SendMessage(previousMessages, newMessage)

        ChatDatabase.addChatMessage(chatID, newMessage)
        ChatDatabase.addChatMessage(chatID, OttagaResponse.data)
        
        return json({ success: true, message: "Data received", data: OttagaResponse.data }, { status: 200 })

    } catch (error) {
        console.error(error);
        return json({ success: false, message: `LLM API Server Error - ${error}` }, { status: 500 });
    }
};

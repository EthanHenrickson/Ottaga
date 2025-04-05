import { ChatDatabase } from '$lib/db/chat';
import { MaliciousMessageLLM, OttagaLLM } from '$lib/llm/LLMClient';
import { json, type RequestHandler } from '@sveltejs/kit';

import type { Message } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
    let allConversationMessages: Message[] = []

    //Get data from the request and save it to variables
    const data = await request.json();
    const chatID = data.chatID
    const newMessage: Message = {
        role: "user",
        content: data.messageInput
    }

    //Get the system message
    const systemMessage = await OttagaLLM.GenerateSystemPrompt()
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
        
        let isMalicious = await MaliciousMessageLLM.CheckMessage(newMessage)
        if (isMalicious) {
            return json({ success: true, message: "Data received", data: { role: "assistant", content: "Please don't manipulate the LLM" } }, { status: 200 })
        }

        let OttagaResponse = await OttagaLLM.Send(allConversationMessages)
        ChatDatabase.addChatMessage(chatID, OttagaResponse)
        return json({ success: true, message: "Data received", data: OttagaResponse }, { status: 200 })

    } catch (error) {
        console.error(error);
        return json({ success: false, message: `LLM API Server Error - ${error}` }, { status: 500 });
    }
};

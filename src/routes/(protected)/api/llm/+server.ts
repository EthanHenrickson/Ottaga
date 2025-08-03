import { OttagaHealthLLM, OttagaSafeGuardLLM } from '$lib/llm/Ottaga';
import { json, type RequestHandler } from '@sveltejs/kit';

import type { ChatMessage } from '$lib/types';
import Analytics from '$lib/utility/analytics/ServerAnalytics';
import { EncodeToSSE } from '$lib/utility/SSE/SSEHelper';
import { ChatServiceSingleton } from '$lib/server/Services/Implementations/ChatService';
import { CreateMessageDTO } from '$lib/server/Services/DTOs/Message';

export const POST: RequestHandler = async ({ request, locals }) => {
    //Get data from the request
    const data = await request.json();
    const chatID = data.chatID
    const newMessage: ChatMessage = {
        role: "user",
        content: data.messageInput
    }

    //Retrieve all previous messages and add them too the conversation
    let previousMessages: ChatMessage[] = []
    const databaseResponse = await ChatServiceSingleton.GetChatMessagesByID(null, chatID)
    if (databaseResponse.success && databaseResponse.data) {
        const databaseMessages = databaseResponse.data.messages

        for (let item of databaseMessages) {
            previousMessages.push(item.ToChatMessage())
        }
    }

    const stream = new ReadableStream({
        async start(controller) {
            try {
                //Check to see if users message is malicious
                const maliciousCheck = await OttagaSafeGuardLLM.CheckUserMessage(newMessage)

                if (maliciousCheck.isMalicious) {
                    const responseMessage = EncodeToSSE(maliciousCheck.messageResponse)
                    controller.enqueue(responseMessage)
                } else {
                    let finalGeneratedResponse = ''
                    let OttagaHealthResponse = OttagaHealthLLM.SendMessage([...previousMessages, newMessage])

                    for await (const messageChunk of OttagaHealthResponse) {
                        if (messageChunk.success) {
                            const responseMessage = EncodeToSSE(messageChunk.data)
                            controller.enqueue(responseMessage);
                            finalGeneratedResponse += messageChunk.data
                        }
                    }
                    ChatServiceSingleton.CreateChatMessage(null, new CreateMessageDTO(chatID, newMessage.role, newMessage.content))
                    ChatServiceSingleton.CreateChatMessage(null, new CreateMessageDTO(chatID, 'assistant', finalGeneratedResponse))
                }

                controller.enqueue(EncodeToSSE("[DONE]"));
                controller.close();

                Analytics.capture({ distinctId: "Anon", event: "api/llm called" })
            } catch (error) {

                Analytics.captureException({ error: "Failed to get Ottaga response", additionalProperties: { errorMessage: error } })
                console.error(error);
                controller.close();


                return json({ success: false, message: `LLM API Server Error - ${error}` }, { status: 500 });
            }
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream;',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    })
};

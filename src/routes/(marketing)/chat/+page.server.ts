import type { PageServerLoad } from "./$types";
import { OttagaHealthLLM } from "$lib/llm/Ottaga";
import { ChatDatabase } from "$lib/db/chat";

export const load: PageServerLoad = async () => {
    let chatID: string

    //Create a new chat save the chat id
    let chatDBResponse = await ChatDatabase.createChat()

    if (chatDBResponse.success) {
        //Generate system prompt
        const systemMessage = OttagaHealthLLM.SystemPrompt
        await ChatDatabase.addChatMessage(chatDBResponse.data.uuid, { role: 'system', content: systemMessage })

        //Return chatID
        chatID = chatDBResponse.data.uuid
    } else {
        throw Error("Failed to create Chat for Ottaga")
    }

    return {
        chatID: chatID
    }
};
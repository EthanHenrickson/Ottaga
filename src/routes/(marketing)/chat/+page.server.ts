import type { PageServerLoad } from "./$types";
import { OttagaHealthLLM } from "$lib/llm/Ottaga";

export const load: PageServerLoad = async () => {
    //Create a new chat save the chat id
    let OttagaResponse = await OttagaHealthLLM.CreateChat()

    return {
        chatID: OttagaResponse.chatID
    }
};
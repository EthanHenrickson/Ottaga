import type { PageServerLoad } from "./$types";
import { Ottaga } from "$lib/llm/ottaga/Ottaga";

export const load: PageServerLoad = async () => {
    //Create a new chat save the chat id
    let OttagaResponse = await Ottaga.CreateChat()

    return {
        chatID: OttagaResponse.chatID
    }
};
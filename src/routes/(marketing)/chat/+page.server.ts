import type { PageServerLoad } from "./$types";
import { Ottaga } from "$lib/llm/Ottaga";

export const load: PageServerLoad = async () => {
    //Create a new chat save the chat id
    let chatID = await Ottaga.CreateChat()

    return {
        chatID: chatID
    }
};
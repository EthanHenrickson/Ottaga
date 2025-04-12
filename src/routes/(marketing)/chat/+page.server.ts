import type { PageServerLoad } from "./$types";
import { ChatDatabase } from "$lib/db/chat";

export const load: PageServerLoad = async () => {
    //Create a new chat save the chat id
    let newChatInstance = ChatDatabase.createChat()

    if(newChatInstance.success){
        return { 
            chatID: newChatInstance.data 
        }
    } else {
        throw Error("Couldn't create new chat")
    }

};
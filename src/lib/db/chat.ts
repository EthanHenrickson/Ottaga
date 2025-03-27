import type { DatabaseDataResponse, DatabaseResponse, Message } from "$lib/types";
import { v4 } from "uuid";
import { BaseDatabase } from "./database";

class ChatDB extends BaseDatabase {
    constructor() {
        super()
    }

    /**
     * Create a new chat session
     * @param {string} userID - The ID of the user
     * @returns {DatabaseDataResponse<string>} The string of the created chat uuid
     */
    createChat(userID: string | null = null): DatabaseDataResponse<string> {
        const uuid = v4()

        const query = this.db.prepare(`Insert into chat (id, FK_userID, title, description, createdDate, modifiable) values (@id, @FK_userID, @title, @description, @createdDate, @modifiable)`)
        const result = query.run({
            id: uuid,
            FK_userID: userID,
            title: "",
            description: "",
            createdDate: Date.now(),
            modifiable: 1,
        })

        if (result.changes === 1) {
            return {
                success: true,
                message: "Chat created successfully",
                data: uuid
            }
        } else {
            return {
                success: false,
                message: "Failed to create chat"
            }
        }
    }

    addChatMessage(chatID: string, message: Message): DatabaseResponse {
        const uuid = v4()

        const query = this.db.prepare(`INSERT into MESSAGE (FK_chatID, role, content, createdDate) values (@FK_chatID, @role, @content, @createdDate)`)
        const result = query.run({
            FK_chatID: chatID,
            role: message.role,
            content: message.content,
            createdDate: Date.now()
        })

        if (result.changes === 1) {
            return {
                success: true,
                message: "Added message to the database"
            }
        } else {
            return {
                success: false,
                message: "Failed to add message to database"
            }
        }
    }

    getChatMessages(chatID: string, rowLimit = 20): DatabaseDataResponse<Message[]> {
        const query = this.db.prepare(`SELECT * FROM message WHERE FK_chatID = ? ORDER BY createdDate DESC LIMIT ?`)
        const result = query.all(chatID, rowLimit) as Message[]
        //Reverse array so that the array[0] is the oldest message first
        result.reverse()

        if (result) {
            //Convert the database scheme into the Message type
            let messageData: Message[] = [];
            result.forEach(element => {
                messageData.push({
                    role: element.role,
                    content: element.content
                })
            });

            return {
                data: messageData,
                success: true,
                message: "Successfully got messages"
            }
        } else {
            return {
                success: false,
                message: "Failed to retrieve data"
            }
        }
    }
}

export const ChatDatabase = new ChatDB()
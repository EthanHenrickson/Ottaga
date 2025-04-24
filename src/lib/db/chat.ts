import type { DatabaseDataResponse, DatabaseResponse, Message } from "$lib/types";
import { v4, v7 } from "uuid";
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
    async createChat(userID: string | null = null): Promise<DatabaseDataResponse<string>> {
        const uuid = v4()

        const query = this.db.insertInto("chat").values({ id: uuid, FK_userID: userID })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
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

    /**
     * Add a new message to a chat session
     * @param {string} chatID - The ID of the chat session
     * @param {Message} message - The message object containing role and content
     * @returns {DatabaseResponse} Response indicating success or failure of message addition
     */
    async addChatMessage(chatID: string, message: Message): Promise<DatabaseResponse> {
        const uuid = v7()

        const query = this.db.insertInto("message").values({ id:uuid, FK_chatID: chatID, role: message.role, content: message.content })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
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

    /**
     * Retrieve messages from a chat session
     * @param {string} chatID - The ID of the chat session
     * @param {number} rowLimit - Maximum number of messages to retrieve (default: 20)
     * @returns {DatabaseDataResponse<Message[]>} Array of messages if successful
     */
    async getChatMessages(chatID: string, rowLimit = 20): Promise<DatabaseDataResponse<Message[]>> {
        const query = this.db.selectFrom("message").selectAll().where("FK_chatID", "=", chatID).orderBy('created_at', 'desc').limit(rowLimit)
        const result = await query.execute()

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

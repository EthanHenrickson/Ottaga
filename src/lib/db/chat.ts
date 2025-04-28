import type { ChatTableRecord, DatabaseDataResponse, DatabaseResponse, Message, UserTableRecord } from "$lib/types";
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
    async createChat(userID: string | null = null): Promise<DatabaseDataResponse<{ uuid: string }>> {
        const uuid = v4()

        const query = this.db.insertInto("chat").values({ id: uuid, FK_userID: userID })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: "Chat created successfully",
                data: { uuid: uuid }
            }
        } else {
            return {
                success: false,
                message: "Failed to create chat"
            }
        }
    }

    /**
     * Retrieve a chat session by its ID
     * @param {string} chatID - The ID of the chat session to retrieve
     * @returns {DatabaseDataResponse<{chatData: ChatTableRecord}>} Response containing the chat data if found
     */
    async getByID(chatID: string): Promise<DatabaseDataResponse<{ chatData: ChatTableRecord }>> {
        const query = this.db.selectFrom("chat").selectAll().where("id", "=", chatID)
        const result = <ChatTableRecord | undefined>await query.executeTakeFirst()

        if (result) {
            return {
                success: true,
                message: "Successfully got chat",
                data: { chatData: result }
            }
        } else {
            return {
                success: false,
                message: "Failed to get chat"
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
        let chatExists = (await this.getByID(chatID)).success
        if (!chatExists) {
            return {
                success: false,
                message: "Failed to add message to database as chatID doesn't exist"
            }
        }

        const uuid = v7()
        const query = this.db.insertInto("message").values({ id: uuid, FK_chatID: chatID, role: message.role, content: message.content })
        const result = await query.executeTakeFirst()
        if (result.numInsertedOrUpdatedRows != undefined) {
            return {
                success: true,
                message: "Added message to the database"
            }
        } else {
            return {
                success: false,
                message: "Failed to add message to the database"
            }
        }
    }

    /**
     * Retrieve messages from a chat session
     * @param {string} chatID - The ID of the chat session
     * @param {number} rowLimit - Maximum number of messages to retrieve (default: 20)
     * @returns {DatabaseDataResponse<Message[]>} Array of messages if successful
     */
    async getChatMessagesByID(chatID: string, rowLimit = 20): Promise<DatabaseDataResponse<{ messages: Message[] }>> {
        let chatExists = (await this.getByID(chatID)).success

        if (!chatExists) {
            return {
                success: false,
                message: "Chat doesn't exist with that chatID"
            }
        }

        const query = this.db.selectFrom("message").selectAll().where("FK_chatID", "=", chatID).orderBy('created_at', 'desc').limit(rowLimit)
        const result = await query.execute()

        //Reverse array so that the array[0] is the oldest message first
        result.reverse()

        //Convert the database scheme into the Message type
        let messageData: Message[] = [];
        result.forEach(element => {
            messageData.push({
                role: element.role,
                content: element.content
            })
        });

        return {
            data: { messages: messageData },
            success: true,
            message: "Successfully got messages"
        }

    }

    /**
     * Delete a chat session by its ID
     * @param {string} chatID - The ID of the chat session to delete
     * @returns {DatabaseResponse} Response indicating success or failure of deletion
     */
    async deleteChatByID(chatID: string): Promise<DatabaseResponse> {
        const query = this.db.deleteFrom("chat").where("id", "=", chatID)
        const result = await query.executeTakeFirst()

        if (result.numDeletedRows == BigInt(1)) {
            return {
                success: true,
                message: "Deleted chat successfully"
            }
        } else {
            return {
                success: false,
                message: "Failed to delete chat"
            }
        }
    }
}

export const ChatDatabase = new ChatDB()

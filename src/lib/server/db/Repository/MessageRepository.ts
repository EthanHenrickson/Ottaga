import type { DatabaseDataResponse, DatabaseResponse, ChatMessage, Role } from "$lib/types";
import type { Message, CreateMessage } from "../databaseTypes";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";

/**
 * Repository interface for managing chat messages in the database
 */
export interface IMessageRepository {
    /**
     * Creates a new message in the database
     * @param data - The message data to create
     * @returns Promise resolving to database operation response
     */
    Create(data: CreateMessage): Promise<DatabaseResponse>
    
    /**
     * Retrieves messages for a specific chat, ordered by creation date
     * @param chatID - The unique identifier of the chat
     * @param rowLimit - Maximum number of messages to retrieve
     * @returns Promise resolving to array of messages or error response
     */
    GetMessagesByID(chatID: string, rowLimit: number): Promise<DatabaseDataResponse<Message[]>>
}

class MessageDBRepository extends BaseDatabaseRepository implements IMessageRepository {
    constructor() {
        super()
    }

    async Create(data: CreateMessage): Promise<DatabaseResponse> {
        const query = this.db.insertInto("message").values(data)
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows != undefined) {
            return {
                success: true,
                message: "Added message to the database",
            }
        } else {
            return {
                success: false,
                message: "Failed to add message to the database"
            }
        }
    }

    async GetMessagesByID(chatID: string, rowLimit: number = 20): Promise<DatabaseDataResponse<Message[]>> {
        const query = this.db.selectFrom("message").selectAll().where("FK_chatID", "=", chatID).orderBy('created_at', 'desc').limit(rowLimit)
        const result = await query.execute()

        //Reverse array so that the array[0] is the oldest message first
        result.reverse()

        if (result.length != 0) {
            return {
                data: result,
                success: true,
                message: "Successfully got messages"
            }
        } else {
            return {
                success: false,
                message: "Failed to get messages"
            }
        }

    }
}

export const MessageDatabaseRepository = new MessageDBRepository()

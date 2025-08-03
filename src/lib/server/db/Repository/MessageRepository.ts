import type { DatabaseDataResponse, DatabaseResponse, ChatMessage, Role } from "$lib/types";
import type { Message, CreateMessage } from "../databaseTypes";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";

export interface IMessageRepository {
    Create(data: CreateMessage): Promise<DatabaseResponse>
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
import type { DatabaseDataResponse, DatabaseResponse } from "$lib/types";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";
import type { Chat, UpdateChat, CreateChat } from "../databaseTypes";

export interface IChatRepository {
    Create(data: CreateChat): Promise<DatabaseResponse>;
    Update(chatID: string, data: UpdateChat): Promise<DatabaseResponse>
    GetByID(chatID: string): Promise<DatabaseDataResponse<Chat>>;
    Delete(chatID: string): Promise<DatabaseResponse>;
}

class ChatDBRepository extends BaseDatabaseRepository implements IChatRepository {
    constructor() {
        super()
    }

    async Create(data: CreateChat): Promise<DatabaseResponse> {
        const query = this.db.insertInto("chat").values(data)
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: "Chat created successfully",
            }
        } else {
            return {
                success: false,
                message: "Failed to create chat"
            }
        }
    }

    async Update(chatID: string, data: UpdateChat): Promise<DatabaseResponse> {
        const query = this.db.updateTable("chat").set(data).where("id", "=", chatID)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: "Chat updated successfully",
            }
        } else {
            return {
                success: false,
                message: "Failed to update chat"
            }
        }
    }

    async GetByID(chatID: string): Promise<DatabaseDataResponse<Chat>> {
        const query = this.db.selectFrom("chat").selectAll().where("id", "=", chatID)
        const result = await query.executeTakeFirst()

        if (result) {
            return {
                success: true,
                message: "Successfully got chat",
                data: result
            }
        } else {
            return {
                success: false,
                message: "Failed to get chat"
            }
        }
    }

    async Delete(chatID: string): Promise<DatabaseResponse> {
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

export const ChatDatabaseRepository = new ChatDBRepository()

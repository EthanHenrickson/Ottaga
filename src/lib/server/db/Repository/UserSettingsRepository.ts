import type { DatabaseResponse, DatabaseDataResponse } from "$lib/types";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";
import type { CreateUserSettings, UpdateUserSettings, UserSettings } from "../databaseTypes";

/**
 * Repository interface for managing user settings in the database.
 * Provides CRUD operations for user-specific configuration data.
 */
export interface IUserSettingsRepository {
    /**
     * Creates new user settings record in the database.
     * @param data - The user settings data to create
     * @returns Promise resolving to database response indicating success/failure
     */
    Create(data: CreateUserSettings): Promise<DatabaseResponse>
    
    /**
     * Retrieves user settings by user ID.
     * @param userID - The unique identifier of the user
     * @returns Promise resolving to database response with user settings data or error
     */
    GetByUserID(userID: string): Promise<DatabaseDataResponse<UserSettings>>
    
    /**
     * Updates existing user settings for a specific user.
     * @param userID - The unique identifier of the user
     * @param updatedData - The partial user settings data to update
     * @returns Promise resolving to database response indicating success/failure
     */
    UpdateByUserID(userID: string, updatedData: UpdateUserSettings): Promise<DatabaseResponse>
}

class UserSettingsDB extends BaseDatabaseRepository implements IUserSettingsRepository {
    constructor() {
        super()
    }

    async Create(data: CreateUserSettings): Promise<DatabaseResponse> {
        const query = this.db.insertInto("user_settings").values(data)
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'User settings was created successfully',
            };

        } else {
            return {
                success: false,
                message: 'User settings creation failed'
            };
        }
    }

    async GetByUserID(userID: string): Promise<DatabaseDataResponse<UserSettings>> {
        const query = this.db.selectFrom("user_settings").selectAll().where("FK_userID", "=", userID)
        const result = <UserSettings | undefined>await query.executeTakeFirst();
        if (result) {
            return {
                success: true,
                message: 'User settings was retrieved successfully',
                data: result
            };

        } else {
            return {
                success: false,
                message: "Couldn't find user settings"
            };
        }
    }

    async UpdateByUserID(userID: string, updatedData: UpdateUserSettings): Promise<DatabaseResponse> {
        const query = this.db.updateTable("user_settings").set(updatedData).where("FK_userID", "=", userID)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows > BigInt(0)) {
            return {
                success: true,
                message: "Updated user settings successfully"
            }
        } else {
            return {
                success: false,
                message: "Failed to update user settings"
            }
        }
    }
}

export const UserSettingsDatabaseRepository = new UserSettingsDB()

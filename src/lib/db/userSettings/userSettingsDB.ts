import type { DatabaseResponse, DatabaseDataResponse } from "$lib/types";
import { v4 } from "uuid";
import { BaseDatabase } from "../database";
import type { Updateable } from "kysely";
import type { NewUserSettings, UserSettings, UserSettingsTable } from "$lib/db/databaseTypes";

/**
 * Service for handling user settings related database operations
 * @extends BaseDatabase
 */
class UserSettingsDB extends BaseDatabase {
    constructor() {
        super()
    }

    /**
     * Create a new user settings record in the database
     * @param {string} userID - The user setting record to create
     * @returns {DatabaseDataResponse<{uuid: string}>} Response indicating success or failure of user creation and the uuid
     */
    async createUserSettings(userID: string): Promise<DatabaseResponse> {
        const existingUserSettings = await this.getByUserID(userID);
        if (existingUserSettings.success) {
            return {
                success: false,
                message: 'User settings are already defined'
            };
        }

        const query = this.db.insertInto("user_settings").values({ FK_userID: userID })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'User settings was created successfully',
            };

        } else {
            console.error('Failed user settings creation - UserID:', userID);

            return {
                success: false,
                message: 'User settings creation failed'
            };
        }
    }

    /**
     * Retrieve a user settings by their ID
     * @param {string} userID - The userID to search for their user settings
     * @returns {DatabaseDataResponse<{ userSettingsRecord: UserSettings }>} The user settings record if found
     */
    async getByUserID(userID: string): Promise<DatabaseDataResponse<{ userSettingsRecord: UserSettings }>> {
        const query = this.db.selectFrom("user_settings").selectAll().where("FK_userID", "=", userID)
        const result = <UserSettings | undefined>await query.executeTakeFirst();
        if (result) {
            return {
                success: true,
                message: 'User settings was retrieved successfully',
                data: { userSettingsRecord: result }
            };

        } else {
            return {
                success: false,
                message: "Couldn't find user settings"
            };
        }
    }

    /**
     * Update a user setting record by user id
     * @param {string} userID - The user id of the user settings to update
     * @param {Updateable<UserSettingsTable>} updatedData - The fields to update
     * @returns {DatabaseResponse} Response indicating success or failure of update
     */
    async updateByUserID(userID: string, updatedData: Updateable<UserSettingsTable>): Promise<DatabaseResponse> {
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

export const UserSettingsDatabase = new UserSettingsDB()

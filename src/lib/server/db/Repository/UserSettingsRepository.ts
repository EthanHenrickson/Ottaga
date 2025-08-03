import type { DatabaseResponse, DatabaseDataResponse } from "$lib/types";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";
import type { CreateUserSettings, UpdateUserSettings, UserSettings } from "../databaseTypes";

export interface IUserSettingsRepository {
    Create(data: CreateUserSettings): Promise<DatabaseResponse>
    GetByUserID(userID: string): Promise<DatabaseDataResponse<UserSettings>>
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

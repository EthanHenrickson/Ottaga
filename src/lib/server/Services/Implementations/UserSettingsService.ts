import type { CreateUserSettings, UserSettings } from "$lib/server/db/databaseTypes";
import { UserSettingsDatabaseRepository, type IUserSettingsRepository } from "$lib/server/db/Repository/UserSettingsRepository";
import type { ServiceResult } from "$lib/types";
import { CreateUserSettingsDTO, UpdateUserSettingsDTO, UserSettingsDTO } from "../DTOs/UserSettings";

export interface IUserSettingsService {
    CreateUserSettings(userID: string, userSettings: CreateUserSettingsDTO): Promise<ServiceResult>
    GetUserSettingsByUserID(userID: string): Promise<ServiceResult<UserSettingsDTO>>
    UpdateUserSettingsByUserID(userID: string, userSettings: UpdateUserSettingsDTO): Promise<ServiceResult>
}

class UserSettingsService implements IUserSettingsService {
    private UserSettingsRepository: IUserSettingsRepository
    constructor(UserSettingsRepository: IUserSettingsRepository) {
        this.UserSettingsRepository = UserSettingsRepository
    }

    async CreateUserSettings(userID: string, userSettings: CreateUserSettingsDTO): Promise<ServiceResult> {
        const existingUserSettings = await this.UserSettingsRepository.GetByUserID(userID);
        if (existingUserSettings.success) {
            return {
                success: false,
                message: "User settings already exist for user"
            }
        } else {
            const dbValues: CreateUserSettings = {
                FK_userID: userID,
                theme: userSettings.theme,
                receiveCommunityDigest: userSettings.receiveCommunityDigest,
                simplifiedLanguage: userSettings.simplifiedLanguage,
                saveConversations: userSettings.saveConversations,
                reduceMotion: userSettings.reduceMotion,
            }
            const dbResponse = await this.UserSettingsRepository.Create(dbValues)
            if (dbResponse.success) {
                return {
                    success: true
                }
            } else {
                return {
                    success: false,
                    message: "There was an error in processing"
                }
            }
        }
    }

    async GetUserSettingsByUserID(userID: string): Promise<ServiceResult<UserSettingsDTO>> {
        const dbResponse = await this.UserSettingsRepository.GetByUserID(userID)
        if (dbResponse.success) {
            return {
                success: true,
                data: new UserSettingsDTO(dbResponse.data)
            }
        } else {
            return {
                success: false,
                message: "There was an error in processing"
            }
        }
    }

    async UpdateUserSettingsByUserID(userID: string, userSettings: UpdateUserSettingsDTO): Promise<ServiceResult> {
        const dbResponse = await this.UserSettingsRepository.UpdateByUserID(userID, userSettings)
        if (dbResponse.success) {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
                message: "There was an error in processing"
            }
        }
    }
}

export const UserSettingsServiceSingleton = new UserSettingsService(UserSettingsDatabaseRepository)
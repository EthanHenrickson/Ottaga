import type { CreateUserSettings } from "$lib/server/db/databaseTypes";
import { UserSettingsDatabaseRepository, type IUserSettingsRepository } from "$lib/server/db/Repository/UserSettingsRepository";
import type { ServiceResult } from "$lib/types";
import { CreateUserSettingsDTO, UpdateUserSettingsDTO, UserSettingsDTO } from "../DTOs/UserSettings";

/**
 * Service interface for managing user settings operations
 */
export interface IUserSettingsService {
    /**
     * Creates new user settings for a specific user
     * @param userID - The unique identifier of the user
     * @param userSettings - The user settings data to create
     * @returns Promise resolving to ServiceResult indicating success or failure
     */
    CreateUserSettings(userID: string, userSettings: CreateUserSettingsDTO): Promise<ServiceResult>
    
    /**
     * Retrieves user settings by user ID
     * @param userID - The unique identifier of the user
     * @returns Promise resolving to ServiceResult containing UserSettingsDTO on success
     */
    GetUserSettingsByUserID(userID: string): Promise<ServiceResult<UserSettingsDTO>>
    
    /**
     * Updates existing user settings for a specific user
     * @param userID - The unique identifier of the user
     * @param userSettings - The updated user settings data
     * @returns Promise resolving to ServiceResult indicating success or failure
     */
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

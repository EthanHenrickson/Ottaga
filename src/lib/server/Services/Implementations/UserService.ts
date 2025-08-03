import type { CreateUser } from "$lib/server/db/databaseTypes";
import { UserDatabaseRepository, type IUserRepository } from "$lib/server/db/Repository/UserRepository";
import type { ServiceResult } from "$lib/types";
import { v4 } from "uuid";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../DTOs/User";
import argon2 from 'argon2';


/**
 * Service interface for user management operations.
 * Handles user creation, retrieval, updates, and deletion with proper validation and error handling.
 */
export interface IUserService {
    /**
     * Creates a new user with hashed password.
     * @param userData - User data transfer object containing name, email, and password
     * @returns Promise resolving to ServiceResult indicating success or failure
     */
    Create(userData: CreateUserDTO): Promise<ServiceResult>
    
    /**
     * Retrieves a user by their email address.
     * @param email - The email address to search for
     * @returns Promise resolving to ServiceResult containing UserDTO if found
     */
    GetByEmail(email: string): Promise<ServiceResult<UserDTO>>
    
    /**
     * Updates an existing user's information.
     * @param userID - The unique identifier of the user to update
     * @param userData - Updated user data transfer object
     * @returns Promise resolving to ServiceResult indicating success or failure
     */
    Update(userID: string, userData: UpdateUserDTO): Promise<ServiceResult>
    
    /**
     * Deletes a user from the system.
     * @param userID - The unique identifier of the user to delete
     * @returns Promise resolving to ServiceResult indicating success or failure
     */
    Delete(userID: string): Promise<ServiceResult>
}

class UserService implements IUserService {
    private UserRepository: IUserRepository
    constructor(userRepository: IUserRepository) {
        this.UserRepository = userRepository
    }

    async Create(userData: CreateUserDTO): Promise<ServiceResult> {
        const uuid = v4()
        const hashedPassword = await argon2.hash(userData.password, { timeCost: 2 });
        const dbValues: CreateUser = {
            id: uuid,
            name: userData.name,
            email: userData.email,
            hashedPassword: hashedPassword
        }

        const isExistingUser = (await this.UserRepository.GetByEmail(userData.email)).success
        if(isExistingUser){
            return {
                success: false,
                message: "User already exists"
            }
        }

        const dbResponse = await this.UserRepository.Create(dbValues)
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

    async GetByEmail(email: string): Promise<ServiceResult<UserDTO>> {
        const existingUser = await this.UserRepository.GetByEmail(email)
        if (existingUser.success) {
            return { 
                success: true,
                data: new UserDTO(existingUser.data)
            }
        } else {
            return {
                success: false,
                message: "There was an error in processing"
            }
        }
    }

    async Update(userID: string, userData: UpdateUserDTO): Promise<ServiceResult> {
        const dbResponse = await this.UserRepository.Update(userID, userData)

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

    async Delete(userID: string): Promise<ServiceResult> {
        const dbResponse = await this.UserRepository.Delete(userID)

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

export const UserServiceSingleton = new UserService(UserDatabaseRepository)

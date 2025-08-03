import type { CreateUser, UpdateUser } from "$lib/server/db/databaseTypes";
import { UserDatabaseRepository, type IUserRepository } from "$lib/server/db/Repository/UserRepository";
import type { DatabaseResponse, ServiceResult } from "$lib/types";
import { v4 } from "uuid";
import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../DTOs/User";
import argon2 from 'argon2';


export interface IUserService {
    Create(userData: CreateUserDTO): Promise<ServiceResult>
    GetByEmail(email: string): Promise<ServiceResult<UserDTO>>
    Update(userID: string, userData: UpdateUserDTO): Promise<ServiceResult>
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
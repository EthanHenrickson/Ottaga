import type { DatabaseResponse, DatabaseDataResponse, ServiceResult } from "$lib/types";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";
import type { CreateUser, User, UpdateUser } from "../databaseTypes";


/**
 * Repository interface for user database operations
 */
export interface IUserRepository {
    /**
     * Creates a new user in the database
     * @param userData - The user data to create
     * @returns Promise resolving to database response indicating success/failure
     */
    Create(userData: CreateUser): Promise<DatabaseResponse>
    
    /**
     * Updates an existing user by ID
     * @param id - The user ID to update
     * @param updatedData - The updated user data
     * @returns Promise resolving to database response indicating success/failure
     */
    Update(id: string, updatedData: UpdateUser): Promise<DatabaseResponse>
    
    /**
     * Deletes a user by ID
     * @param id - The user ID to delete
     * @returns Promise resolving to database response indicating success/failure
     */
    Delete(id: string): Promise<DatabaseResponse>

    /**
     * Retrieves a user by their ID
     * @param id - The user ID to search for
     * @returns Promise resolving to service result containing user data or error
     */
    GetByUserID(id: string): Promise<ServiceResult<User>>

    /**
     * Retrieves a user by their email address
     * @param email - The email address to search for
     * @returns Promise resolving to database response containing user data or error
     */
    GetByEmail(email: string): Promise<DatabaseDataResponse<User>>
    
    /**
     * Updates an existing user by email address
     * @param email - The email address of the user to update
     * @param updatedData - The updated user data
     * @returns Promise resolving to database response indicating success/failure
     */
    UpdateByEmail(email: string, updatedData: UpdateUser): Promise<DatabaseResponse>
    
    /**
     * Deletes a user by email address
     * @param email - The email address of the user to delete
     * @returns Promise resolving to database response indicating success/failure
     */
    DeleteByEmail(email: string): Promise<DatabaseResponse>
}


class UserDBRepository extends BaseDatabaseRepository {
    constructor() {
        super()
    }

    async Create(userData: CreateUser): Promise<DatabaseResponse> {
        const query = this.db.insertInto("user").values({ id: userData.id, name: userData.name, email: userData.email, hashedPassword: userData.hashedPassword })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'User was created successfully',
            };

        } else {
            console.error('Failed cookie creation - BaseUserRecord:', userData);

            return {
                success: false,
                message: 'User creation failed'
            };
        }
    }

    async GetByEmail(email: string): Promise<DatabaseDataResponse<User>> {
        const query = this.db.selectFrom("user").selectAll().where("email", "=", email)
        const result = <User | undefined>await query.executeTakeFirst();
        if (result) {
            return {
                success: true,
                message: 'User was retrieved successfully',
                data: result
            };

        } else {
            return {
                success: false,
                message: "Couldn't find user"
            };
        }
    }

    async GetByUserID(id: string) : Promise<ServiceResult<User>> {
        const query = this.db.selectFrom("user").selectAll().where("id", "=", id)
        const result = <User | undefined>await query.executeTakeFirst();
        if (result) {
            return {
                success: true,
                message: 'User was retrieved successfully',
                data: result
            };

        } else {
            return {
                success: false,
                message: "Couldn't find user"
            };
        }
    }

    async Update(id: string, updatedData: UpdateUser): Promise<DatabaseResponse> {
        const query = this.db.updateTable("user").set(updatedData).where("id", "=", id)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows > BigInt(0)) {
            return {
                success: true,
                message: "Updated user successfully"
            }
        } else {
            return {
                success: false,
                message: "Failed to update user"
            }
        }
    }

    async UpdateByEmail(email: string, updatedData: UpdateUser): Promise<DatabaseResponse> {
        const query = this.db.updateTable("user").set(updatedData).where("email", "=", email)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows > BigInt(0)) {
            return {
                success: true,
                message: "Updated user successfully"
            }
        } else {
            return {
                success: false,
                message: "Failed to update user"
            }
        }
    }

    async Delete(id: string): Promise<DatabaseResponse> {
        const query = this.db.deleteFrom("user").where("id", "=", id)
        const result = await query.executeTakeFirst()

        if (result.numDeletedRows == BigInt(1)) {
            return {
                success: true,
                message: "Successfully deleted"
            }
        } else {
            return {
                success: false,
                message: "Failed to delete user by id"
            }
        }
    }

    async DeleteByEmail(email: string): Promise<DatabaseResponse> {
        const query = this.db.deleteFrom("user").where("email", "=", email)
        const result = await query.executeTakeFirst()

        if (result.numDeletedRows == BigInt(1)) {
            return {
                success: true,
                message: "Successfully deleted"
            }
        } else {
            return {
                success: false,
                message: "Failed to delete user by email"
            }
        }
    }
}

export const UserDatabaseRepository = new UserDBRepository()

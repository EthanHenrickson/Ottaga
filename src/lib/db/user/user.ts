import type { NewUserTableRecord, DatabaseResponse, DatabaseDataResponse, UserTableRecord } from "$lib/types";
import { v4 } from "uuid";
import { BaseDatabase } from "../database";
import type { Updateable } from "kysely";
import type { UserTable } from "$lib/databaseTypes";

/**
 * Service for handling user-related database operations
 * @extends BaseDatabase
 */
class UserDB extends BaseDatabase {
    constructor() {
        super()
    }

    /**
     * Create a new user in the database
     * @param {NewUserTableRecord} userData - The user record to create
     * @returns {DatabaseDataResponse<{uuid: string}>} Response indicating success or failure of user creation and the uuid
     */
    async createUser(userData: NewUserTableRecord): Promise<DatabaseDataResponse<{ uuid: string }>> {
        const existingUser = await this.getByEmail(userData.email);
        if (existingUser.success) {

            return {
                success: false,
                message: 'Email already in use'
            };
        }

        const uuid = v4()

        const query = this.db.insertInto("user").values({ id: uuid, name: userData.name, email: userData.email, hashedPassword: userData.hashedPassword })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'User was created successfully',
                data: { uuid: uuid }
            };

        } else {
            console.error('Failed cookie creation - BaseUserRecord:', userData);

            return {
                success: false,
                message: 'User creation failed'
            };
        }
    }

    /**
     * Retrieve a user by their email address
     * @param {string} email - The email address to search for
     * @returns {DatabaseDataResponse<{ userRecord: UserTableRecord }>} The user record if found
     */
    async getByEmail(email: string): Promise<DatabaseDataResponse<{ userRecord: UserTableRecord }>> {
        const query = this.db.selectFrom("user").selectAll().where("email", "=", email)
        const result = <UserTableRecord | undefined>await query.executeTakeFirst();
        if (result) {
            return {
                success: true,
                message: 'User was retrieved successfully',
                data: { userRecord: result }
            };

        } else {
            return {
                success: false,
                message: "Couldn't find user"
            };
        }
    }

    /**
     * Update a user record by ID
     * @param {string} id - The ID of the user to update
     * @param {Updateable<UserTable>} updatedData - The fields to update
     * @returns {DatabaseResponse} Response indicating success or failure of update
     */
    async updateByID(id: string, updatedData: Updateable<UserTable>): Promise<DatabaseResponse> {
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

    /**
     * Update a user record by email
     * @param {string} email - The email of the user to update
     * @param {Updateable<UserTable>} updatedData - The fields to update
     * @returns {DatabaseResponse} Response indicating success or failure of update
     */
    async updateByEmail(email: string, updatedData: Updateable<UserTable>): Promise<DatabaseResponse> {
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

    /**
     * Delete a user by ID
     * @param {string} id - The ID of the user to delete
     * @returns {DatabaseResponse} Response indicating success or failure of deletion
     */
    async deleteByID(id: string): Promise<DatabaseResponse> {
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

    /**
     * Delete a user by email
     * @param {string} email - The email of the user to delete
     * @returns {DatabaseResponse} Response indicating success or failure of deletion
     */
    async deleteByEmail(email: string): Promise<DatabaseResponse> {
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

export const UserDatabase = new UserDB()

import type { NewUserRecord, DatabaseResponse, DatabaseDataResponse, UserRecord } from "$lib/types";
import { v4 } from "uuid";
import { BaseDatabase } from "./database";

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
     * @param {NewUserRecord} user - The user record to create
     * @returns {DatabaseResponse} Response indicating success or failure of user creation
     */
    async createUser(user: NewUserRecord): Promise<DatabaseResponse> {
        const existingUser = await this.getUserByEmail(user.email);
        if (existingUser.success) {
            return {
                success: false,
                message: 'Email already in use'
            };
        }

        const uuid = v4()

        const query = this.db.insertInto("user").values({id: uuid, name: user.name, email: user.email, hashedPassword: user.hashedPassword})
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'User was created successfully'
            };

        } else {
            console.error('Failed cookie creation - BaseUserRecord:', user);

            return {
                success: false,
                message: 'User creation failed'
            };
        }
    }

    /**
     * Retrieve a user by their email address
     * @param {string} email - The email address to search for
     * @returns {DatabaseDataResponse<UserRecord>} The user record if found
     */
    async getUserByEmail(email: string): Promise<DatabaseDataResponse<UserRecord>> {
        const query = this.db.selectFrom("user").selectAll().where("email", "=", email)
        const result = <UserRecord | undefined> await query.executeTakeFirst();
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
}

export const UserDatabase = new UserDB()

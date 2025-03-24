import type { NewUserRecord, DatabaseResponse, DatabaseDataResponse, UserRecord } from "$lib/types";
import { v4 } from "uuid";
import { BaseDatabase } from "./database";

class UserDB extends BaseDatabase {
    constructor() {
        super()
    }

    /**
     * Create a new user in the database
     * @param {NewUserRecord} user - The user record to create
     * @returns {DatabaseResponse} Response indicating success or failure of user creation
     */
    createUser(user: NewUserRecord): DatabaseResponse {
        const existingUser = this.getUserByEmail(user.email);
        if (existingUser.success) {
            return {
                success: false,
                message: 'Email already in use'
            };
        }
        const query = this.db.prepare('Insert into user (id, firstName, email, hashedPassword, createdDate, details, deleted) VALUES (@id, @firstName, @email, @hashedPassword, @createdDate, @details, @deleted)');

        const uuid = v4()
        const result = query.run({ id: uuid, firstName: user.firstName, email: user.email, hashedPassword: user.hashedPassword, createdDate: user.createdDate, details: "", deleted: 0 });

        if (result.changes == 1) {
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
    getUserByEmail(email: string): DatabaseDataResponse<UserRecord> {
        const query = this.db.prepare('Select * from user WHERE email = ?');
        const result = <UserRecord | null>query.get(email);
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

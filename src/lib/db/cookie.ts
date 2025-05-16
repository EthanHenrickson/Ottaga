import type { DatabaseResponse, DatabaseDataResponse, CookieTableRecord } from "$lib/types";
import { v7 } from "uuid";
import { BaseDatabase } from "./database";

/**
 * Service for handling user authentication and cookie management
 * @extends BaseDatabaseService
 */
class CookieDB extends BaseDatabase {
    constructor() {
        super();
    }

    /**
     * Create a new authentication cookie for a user
     * @param {number} userID - The ID of the user the cookie belongs to
     * @returns {DatabaseDataResponse<string>} Response indicating success or failure with cookie uuid returned
     */
    async createCookie(userID: string): Promise<DatabaseDataResponse<string>> {
        const uuid = v7()

        const futureExpireTime = new Date();
        futureExpireTime.setTime(futureExpireTime.getTime() + (30 * 60 * 1000));

        const query = this.db.insertInto("cookie").values({ id: uuid, FK_userID: userID, expireTime: futureExpireTime });
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Successful cookie creation',
                data: uuid
            };

        } else {
            console.error('Failed cookie creation - UserID:', userID);

            return {
                success: false,
                message: 'Failed cookie creation'
            };
        }
    }

    /**
     * Remove a specific cookie from the database
     * @param {string} id - The unique identifier of the cookie to remove
     * @returns {DatabaseResponse} Response indicating success or failure of cookie deletion
     */
    async deleteByID(id: string): Promise<DatabaseResponse> {
        const query = this.db.deleteFrom("cookie").where("id", "=", id)
        const result = await query.executeTakeFirst();

        if (result.numDeletedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Successful cookie deletion'
            };

        } else {
            console.error('Failed to remove cookie - userID:', id);

            return {
                success: false,
                message: 'Failed cookie deletion'
            };
        }
    }

    /**
     * Retrieve a cookie by its ID
     * @param {string} id - The ID of the cookie to retrieve
     * @returns {DatabaseDataResponse<CookieTableRecord>} The cookie record if found
     */
    async getByID(id: string): Promise<DatabaseDataResponse<{ cookie: CookieTableRecord }>> {
        const query = this.db.selectFrom("cookie").selectAll().where("id", "=", id)
        const result = <CookieTableRecord | undefined>await query.executeTakeFirst()

        if (result) {
            return {
                success: true,
                message: 'Found cookie successfully',
                data: { cookie: result }
            };

        } else {
            console.error('Failed cookie finding - userID:', id);

            return {
                success: false,
                message: 'Failed to find cookie'
            };
        }
    }

    /**
     * Update the expiration time of a specific cookie
     * @param {string} id - The unique identifier of the cookie to update
     * @returns {DatabaseResponse} Response indicating success or failure of cookie update
     */
    async updateByID(id: string): Promise<DatabaseResponse> {
        const futureExpireTime = new Date();
        futureExpireTime.setTime(futureExpireTime.getTime() + (30 * 60 * 1000));

        const query = this.db.updateTable("cookie").set({ expireTime: futureExpireTime }).where("id", "=", id)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Updated cookie successfully'
            };

        } else {
            console.error('Failed cookie updating - cookieID:', id);

            return {
                success: false,
                message: 'Failed to update cookie'
            };
        }
    }
}

export const CookieDatabase = new CookieDB()
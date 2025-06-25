import type { DatabaseResponse, DatabaseDataResponse, CookieTableRecord } from "$lib/types";
import { v7 } from "uuid";
import { BaseDatabase } from "./database";
import Analytics from "$lib/utility/ServerAnalytics";

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
        const futureExpireTime = new Date(Date.now() + (30 * 60 * 1000));

        const query = this.db.insertInto("cookie").values({ id: uuid, FK_userID: userID, expireTime: futureExpireTime });
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Successful cookie creation',
                data: uuid
            };

        } else {
            Analytics.captureException(`Failed to create cookie for userId - ${userID}`)

            return {
                success: false,
                message: 'Failed cookie creation'
            };
        }
    }

    /**
     * Remove a specific cookie from the database
     * @param {string} cookieID - The unique identifier of the cookie to remove
     * @returns {DatabaseResponse} Response indicating success or failure of cookie deletion
     */
    async deleteByID(cookieID: string): Promise<DatabaseResponse> {
        const query = this.db.deleteFrom("cookie").where("id", "=", cookieID)
        const result = await query.executeTakeFirst();

        if (result.numDeletedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Successful cookie deletion'
            };

        } else {
            Analytics.captureException(`Failed to delete cookie for cookieID - ${cookieID}`)

            return {
                success: false,
                message: 'Failed cookie deletion'
            };
        }
    }

    /**
     * Retrieve a cookie by its ID
     * @param {string} cookieID - The ID of the cookie to retrieve
     * @returns {DatabaseDataResponse<CookieTableRecord>} The cookie record if found
     */
    async getByID(cookieID: string): Promise<DatabaseDataResponse<{ cookie: CookieTableRecord }>> {
        const query = this.db.selectFrom("cookie").selectAll().where("id", "=", cookieID)
        const result = <CookieTableRecord | undefined>await query.executeTakeFirst()

        if (result) {
            return {
                success: true,
                message: 'Found cookie successfully',
                data: { cookie: result }
            };

        } else {
            console.error('Failed cookie finding - userID:', cookieID);

            return {
                success: false,
                message: 'Failed to find cookie'
            };
        }
    }

    /**
     * Update the expiration time of a specific cookie
     * @param {string} cookieID - The unique identifier of the cookie to update
     * @returns {DatabaseResponse} Response indicating success or failure of cookie update
     */
    async updateByID(cookieID: string): Promise<DatabaseResponse> {
        const futureExpireTime = new Date(Date.now() + (30 * 60 * 1000));

        const query = this.db.updateTable("cookie").set({ expireTime: futureExpireTime }).where("id", "=", cookieID)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Updated cookie successfully'
            };

        } else {
            console.error('Failed cookie updating - cookieID:', cookieID);

            return {
                success: false,
                message: 'Failed to update cookie'
            };
        }
    }
}

export const CookieDatabase = new CookieDB()
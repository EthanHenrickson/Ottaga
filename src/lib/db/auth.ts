import type { DatabaseResponse, DatabaseDataResponse, cookie } from "$lib/types";
import { BaseDatabase } from "./database";

/**
 * Service for handling user authentication and cookie management
 * @extends BaseDatabaseService
 */
class AuthDB extends BaseDatabase {
    constructor() {
        super();
    }

    /**
     * Create a new authentication cookie for a user
     * @param {string} cookieID - The unique identifier for the cookie
     * @param {number} userID - The ID of the user the cookie belongs to
     * @returns {DatabaseResponse} Response indicating success or failure of cookie creation
     */
    createCookie(cookieID: string, userID: string): DatabaseResponse {
        const query = this.db.prepare('Insert into cookie (id, FK_userID, expireTime) values (@id, @userID, @expireTime)');
        const result = query.run({
            id: cookieID,
            userID: userID,
            expireTime: Date.now() + 60 * 60 * 1000 // Cookie expires in 1 hour
        });
        if (result.changes == 1) {
            return {
                success: true,
                message: 'Successful cookie creation'
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
    removeCookie(id: string): DatabaseResponse {
        const query = this.db.prepare('DELETE FROM cookie WHERE id = ?');
        const result = query.run(id);
        if (result.changes == 1) {
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
     * @param {string} userID - The ID of the cookie to retrieve
     * @returns {DatabaseDataResponse<cookie>} The cookie record if found
     */
    getCookie(userID: string): DatabaseDataResponse<cookie> {
        const query = this.db.prepare('Select * from cookie WHERE id = ?');
        const result = <cookie | null>query.get(userID);
        if (result) {
            return {
                success: true,
                message: 'Found cookie successfully',
                data: result
            };

        } else {
            console.error('Failed cookie finding - userID:', userID);

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
    updateCookie(cookieID: string): DatabaseResponse {
        const query = this.db.prepare('Update cookie SET expireTime = ? WHERE id = ?');
        const result = query.run(Date.now() + 1000 * 30 * 60, cookieID);
        if (result.changes == 1) {
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

export const AuthDatabase = new AuthDB()
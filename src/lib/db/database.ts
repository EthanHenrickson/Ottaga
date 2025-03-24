import type { BaseUserRecord, cookie, DatabaseDataResponse, DatabaseResponse, UserRecord } from "../types";
import Database from 'better-sqlite3';
/**
 * Base class for database services providing a singleton database connection
 * @remarks
 * Ensures a single database instance is used across all service instances
 */
class BaseDatabaseService {
    /** The database connection instance */
    protected db: Database.Database;
    /** Singleton database instance */
    private static dbInstance: Database.Database | null = null;

    constructor() {
        // Check if database instance is null and create if necessary
        if (!BaseDatabaseService.dbInstance) {
            try {
                // Create a new database connection
                BaseDatabaseService.dbInstance = new Database('mydb.sqlite', { verbose: console.log });
                BaseDatabaseService.dbInstance.prepare('PRAGMA journal_mode = WAL').run();
            } catch (error) {
                console.error('Database initialization failed:', error);
                throw error;
            }
        }
        // Set database to the single db instance
        this.db = BaseDatabaseService.dbInstance;
    }
}

/**
 * Service for handling user authentication and cookie management
 * @extends BaseDatabaseService
 */
class AuthService extends BaseDatabaseService {
    constructor() {
        super();
    }

    /**
     * Create a new user in the database
     * @param {BaseUserRecord} user - The user record to create
     * @returns {DatabaseResponse} Response indicating success or failure of user creation
     */
    createUser(user: BaseUserRecord): DatabaseResponse {
        const existingUser = this.getUserByEmail(user.email);
        if (existingUser.success) {
            return {
                success: false,
                message: 'Email already in use'
            };
        }
        const query = this.db.prepare('Insert into users (firstName, lastName, email, hashedPassword, deleted) VALUES (@firstName, @lastName, @email, @hashedPassword, @deleted)');
        const result = query.run({ firstName: user.firstName, lastName: user.lastName, email: user.email, hashedPassword: user.hashedPassword, deleted: 0 });
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
        const query = this.db.prepare('Select * from users WHERE email = ?');
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

    /**
     * Create a new authentication cookie for a user
     * @param {string} cookieID - The unique identifier for the cookie
     * @param {number} userID - The ID of the user the cookie belongs to
     * @returns {DatabaseResponse} Response indicating success or failure of cookie creation
     */
    createCookie(cookieID: string, userID: number): DatabaseResponse {
        const query = this.db.prepare('Insert into cookie (id, userID, expireTime) values (@id, @userID, @expireTime)');
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

export const AuthDatabaseService = new AuthService()
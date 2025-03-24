import Database from 'better-sqlite3';
/**
 * Base class for database services providing a singleton database connection
 * @remarks
 * Ensures a single database instance is used across all service instances
 */
export class BaseDatabase {
    /** The database connection instance */
    protected db: Database.Database;
    /** Singleton database instance */
    private static dbInstance: Database.Database | null = null;

    constructor() {
        // Check if database instance is null and create if necessary
        if (!BaseDatabase.dbInstance) {
            try {
                // Create a new database connection
                BaseDatabase.dbInstance = new Database('mydb.sqlite', { verbose: console.log });
                BaseDatabase.dbInstance.prepare('PRAGMA journal_mode = WAL').run();
            } catch (error) {
                console.error('Database initialization failed:', error);
                throw error;
            }
        }
        // Set database to the single db instance
        this.db = BaseDatabase.dbInstance;
    }
}
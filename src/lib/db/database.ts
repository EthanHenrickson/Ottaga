import type { Database } from '$lib/db/databaseTypes'
import { POSTGRES_URL } from '$env/static/private';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

/**
 * Base class for database services providing a singleton database connection
 * Ensures a single database instance is used across all service instances
 */
export abstract class BaseDatabase {
    /** The database connection instance */
    protected db;
    /** Singleton database instance */
    private static dbInstance: Kysely<Database> | null = null;

    constructor() {
        // Check if database instance is null and create if necessary
        if (!BaseDatabase.dbInstance) {
            const dialect = new PostgresDialect({
                pool: new Pool({
                    connectionString: POSTGRES_URL,
                })
            })

            try {
                // Create a new database connection
                BaseDatabase.dbInstance = new Kysely<Database>({
                    dialect,
                })
            } catch (error) {
                console.error('Database initialization failed:', error);
                throw error;
            }
        }
        // Set database to the single db instance
        this.db = BaseDatabase.dbInstance;
    }
}
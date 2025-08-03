import type { DatabaseResponse, DatabaseDataResponse } from "$lib/types";
import type { Cookie, CreateCookie, UpdateCookie } from "../databaseTypes";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";

export interface ICookieRepository {
    Create(data: CreateCookie): Promise<DatabaseResponse>
    GetByID(cookieID: string): Promise<DatabaseDataResponse<Cookie>>
    UpdateCookieTime(cookieID: string, data: UpdateCookie): Promise<DatabaseResponse>
    Delete(cookieID: string): Promise<DatabaseResponse>
}

class CookieDBRepository extends BaseDatabaseRepository implements ICookieRepository {
    constructor() {
        super();
    }

    async Create(data: CreateCookie): Promise<DatabaseResponse> {
        const query = this.db.insertInto("cookie").values(data);
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Successful cookie creation',
            };

        } else {
            return {
                success: false,
                message: 'Failed cookie creation'
            };
        }
    }

    async GetByID(cookieID: string): Promise<DatabaseDataResponse<Cookie>> {
        const query = this.db.selectFrom("cookie").selectAll().where("id", "=", cookieID)
        const result = <Cookie | undefined>await query.executeTakeFirst()

        if (result) {
            return {
                success: true,
                message: 'Found cookie successfully',
                data: result
            };

        } else {
            return {
                success: false,
                message: 'Failed to find cookie'
            };
        }
    }

    async UpdateCookieTime(cookieID: string, data: UpdateCookie): Promise<DatabaseResponse> {
        const query = this.db.updateTable("cookie").set(data).where("id", "=", cookieID)
        const result = await query.executeTakeFirst()

        if (result.numUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Updated cookie successfully'
            };
        } else {
            return {
                success: false,
                message: 'Failed to update cookie'
            };
        }
    }

    async Delete(cookieID: string): Promise<DatabaseResponse> {
        const query = this.db.deleteFrom("cookie").where("id", "=", cookieID)
        const result = await query.executeTakeFirst();

        if (result.numDeletedRows == BigInt(1)) {
            return {
                success: true,
                message: 'Successful cookie deletion'
            };
        } else {
            return {
                success: false,
                message: 'Failed cookie deletion'
            };
        }
    }
}

export const CookieDatabaseRepository = new CookieDBRepository()
import type { DatabaseResponse, DatabaseDataResponse, ServiceResult } from "$lib/types";
import { BaseDatabaseRepository } from "./BaseDatabaseRepository";
import type { CreateUser, User, UpdateUser } from "../databaseTypes";


export interface IUserRepository {
    Create(userData: CreateUser): Promise<DatabaseResponse>
    Update(id: string, updatedData: UpdateUser): Promise<DatabaseResponse>
    Delete(id: string): Promise<DatabaseResponse>

    GetByUserID(id: string): Promise<ServiceResult<User>>

    GetByEmail(email: string): Promise<DatabaseDataResponse<User>>
    UpdateByEmail(email: string, updatedData: UpdateUser): Promise<DatabaseResponse>
    DeleteByEmail(email: string): Promise<DatabaseResponse>
}


class UserDBRepository extends BaseDatabaseRepository {
    constructor() {
        super()
    }

    async Create(userData: CreateUser): Promise<DatabaseResponse> {
        const query = this.db.insertInto("user").values({ id: userData.id, name: userData.name, email: userData.email, hashedPassword: userData.hashedPassword })
        const result = await query.executeTakeFirst()

        if (result.numInsertedOrUpdatedRows == BigInt(1)) {
            return {
                success: true,
                message: 'User was created successfully',
            };

        } else {
            console.error('Failed cookie creation - BaseUserRecord:', userData);

            return {
                success: false,
                message: 'User creation failed'
            };
        }
    }

    async GetByEmail(email: string): Promise<DatabaseDataResponse<User>> {
        const query = this.db.selectFrom("user").selectAll().where("email", "=", email)
        const result = <User | undefined>await query.executeTakeFirst();
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

    async GetByUserID(id: string) : Promise<ServiceResult<User>> {
        const query = this.db.selectFrom("user").selectAll().where("id", "=", id)
        const result = <User | undefined>await query.executeTakeFirst();
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

    async Update(id: string, updatedData: UpdateUser): Promise<DatabaseResponse> {
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

    async UpdateByEmail(email: string, updatedData: UpdateUser): Promise<DatabaseResponse> {
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

    async Delete(id: string): Promise<DatabaseResponse> {
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

    async DeleteByEmail(email: string): Promise<DatabaseResponse> {
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

export const UserDatabaseRepository = new UserDBRepository()

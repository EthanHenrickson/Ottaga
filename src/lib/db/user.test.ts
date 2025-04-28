import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { UserDatabase } from "./user";
import type { NewUserTableRecord } from "$lib/types";
import { faker } from '@faker-js/faker';

describe("User Database Operations", () => {
    let testUser: NewUserTableRecord;
    let createdUserId: string;

    beforeEach(async () => {
        testUser = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            hashedPassword: faker.internet.password(),
        };
        vi.clearAllMocks();
    });

    afterEach(async () => {
        await UserDatabase.deleteByEmail(testUser.email);
    })

    describe("Create User", () => {
        it("should successfully create a new user", async () => {
            const createResponse = await UserDatabase.createUser(testUser);
            expect(createResponse.success).toBeTruthy();
            expect(createResponse.data?.uuid).toBeDefined();
            createdUserId = createResponse.data!.uuid;

            const getResponse = await UserDatabase.getByEmail(testUser.email);
            expect(getResponse.success).toBeTruthy();
            expect(getResponse.data?.userRecord).toMatchObject({
                email: testUser.email,
                name: testUser.name
            });
        });

        it("should fail when creating user with duplicate email", async () => {
            await UserDatabase.createUser(testUser);
            const duplicateResponse = await UserDatabase.createUser(testUser);
            expect(duplicateResponse.success).toBeFalsy();
            expect(duplicateResponse.data?.uuid).toBeUndefined();
        });
    });

    describe("Get User", () => {
        it("should return null for non-existent email", async () => {
            const response = await UserDatabase.getByEmail("nonexistent@example.com");
            expect(response.success).toBeFalsy();
            expect(response.data).toBeUndefined();
        });

        it("should return user by email after creation", async () => {
            const createResponse = await UserDatabase.createUser(testUser);
            createdUserId = createResponse.data!.uuid;

            const getResponse = await UserDatabase.getByEmail(testUser.email);
            expect(getResponse.success).toBeTruthy();
            expect(getResponse.data?.userRecord.id).toBe(createdUserId);
        });
    });

    describe("Update User", () => {
        beforeEach(async () => {
            const createResponse = await UserDatabase.createUser(testUser);
            createdUserId = createResponse.data!.uuid;
        });

        it("should update user name by ID", async () => {
            const newName = faker.person.fullName();
            const updateResponse = await UserDatabase.updateByID(createdUserId, { name: newName });
            expect(updateResponse.success).toBeTruthy();

            const getResponse = await UserDatabase.getByEmail(testUser.email);
            expect(getResponse.data?.userRecord.name).toBe(newName);

        });

        it("should update user email by ID", async () => {
            const newEmail = faker.internet.email();
            const updateResponse = await UserDatabase.updateByID(createdUserId, { email: newEmail });
            expect(updateResponse.success).toBeTruthy();

            const getResponse = await UserDatabase.getByEmail(newEmail);
            expect(getResponse.success).toBeTruthy();

            //Delete after test
            await UserDatabase.deleteByEmail(newEmail)
        });

        it("should fail to update non-existent user", async () => {
            const response = await UserDatabase.updateByID("9a99020a-bbac-4668-9740-45bdf379a152", { name: "new name" });
            expect(response.success).toBeFalsy();
        });
    });

    describe("Delete User", () => {
        beforeEach(async () => {
            const createResponse = await UserDatabase.createUser(testUser);
            createdUserId = createResponse.data!.uuid;
        });

        it("should delete user by ID", async () => {
            const deleteResponse = await UserDatabase.deleteByID(createdUserId);
            expect(deleteResponse.success).toBeTruthy();

            const getResponse = await UserDatabase.getByEmail(testUser.email);
            expect(getResponse.success).toBeFalsy();
        });

        it("should delete user by email", async () => {
            const deleteResponse = await UserDatabase.deleteByEmail(testUser.email);
            expect(deleteResponse.success).toBeTruthy();

            const getResponse = await UserDatabase.getByEmail(testUser.email);
            expect(getResponse.success).toBeFalsy();
        });

        it("should fail to delete non-existent user", async () => {
            const response = await UserDatabase.deleteByID("9a99020a-bbac-4668-9740-45bdf379a152");
            expect(response.success).toBeFalsy();
        });
    });
});

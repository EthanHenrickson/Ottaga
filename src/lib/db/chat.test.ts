import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ChatDatabase } from "./chat";
import type { Message } from "$lib/types";
import { v4, v7 } from "uuid";
import { UserDatabase } from "./user";

describe("Chat Database Operations", () => {

    let testChatID: string;
    let testUserID: string;
    const testMessages: Message[] = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
        { role: "user", content: "How are you?" }
    ];

    beforeEach(async () => {
        let userDatabaseResponse = await UserDatabase.createUser({ email: "testsfafee@gmail.com", hashedPassword: "ijnawewafe" })
        if (userDatabaseResponse.success) {
            testUserID = userDatabaseResponse.data.uuid
        }

        const createResponse = await ChatDatabase.createChat(testUserID);
        testChatID = createResponse.data!.uuid;
        vi.clearAllMocks();
    });

    afterEach(async () => {
        await UserDatabase.deleteByEmail("testsfafee@gmail.com")
    })

    describe("Create Chat", () => {
        it("should successfully create a new chat", async () => {
            const response = await ChatDatabase.createChat(testUserID);
            expect(response.success).toBeTruthy();
            expect(response.data?.uuid).toBeDefined();
        });

        it("should create chat with null user ID", async () => {
            const response = await ChatDatabase.createChat(null);
            expect(response.success).toBeTruthy();

            //Clean up
            await ChatDatabase.deleteChatByID(response.data!.uuid)
        });
    });

    describe("Add Chat Message", () => {
        it("should successfully add message to chat", async () => {
            const response = await ChatDatabase.addChatMessage(
                testChatID,
                testMessages[0]
            );
            expect(response.success).toBeTruthy();
        });

        it("should fail with invalid chat ID", async () => {
            const response = await ChatDatabase.addChatMessage(
                v7(),
                testMessages[0]
            );
            expect(response.success).toBeFalsy();
        });
    });

    describe("Get Chat Messages", () => {
        beforeEach(async () => {
            // Add test messages
            for (const msg of testMessages) {
                await ChatDatabase.addChatMessage(testChatID, msg);
            }
        });

        it("should retrieve all messages in correct order", async () => {
            const response = await ChatDatabase.getChatMessagesByID(testChatID);
            expect(response.success).toBeTruthy();
            expect(response.data?.messages.length).toBe(3);
            expect(response.data?.messages[0].content).toBe("Hello");
            expect(response.data?.messages[2].content).toBe("How are you?");
        });

        it("should respect row limit", async () => {
            const response = await ChatDatabase.getChatMessagesByID(testChatID, 2);
            expect(response.success).toBeTruthy();
            expect(response.data?.messages.length).toBe(2);
        });

        it("Should return empty array", async () => {
            const newChat = await ChatDatabase.createChat(testUserID);
            const response = await ChatDatabase.getChatMessagesByID(newChat.data!.uuid);
            expect(response.success).toBeTruthy();
            expect(response.data?.messages.length).toBe(0);
        });

        it("should fail with invalid chat ID", async () => {
            const response = await ChatDatabase.getChatMessagesByID(v7());
            expect(response.success).toBeFalsy();
        });
    });

    describe("Delete chat", () => {
        beforeEach(async () => {
            // Add test messages
            for (const msg of testMessages) {
                await ChatDatabase.addChatMessage(testChatID, msg);
            }
        });

        it("Should successfully delete chat and its messages", async () => {
            const response = await ChatDatabase.deleteChatByID(testChatID)
            expect(response.success).toBeTruthy();

            const checkResponse = await ChatDatabase.getChatMessagesByID(testChatID)
            expect(checkResponse.success).toBeFalsy()
        });
    });
});

/**
 * Tests for LLMHelper's message moderation functionality
 * 
 * Verifies the LLMHelper's ability to detect and handle potentially
 * malicious user messages before they reach the main assistant.
 */
import { LLMHelper } from "./LLMHelper";
import { GoodPrompts, MaliciousPrompts } from "./TestPrompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock OpenAI client
const mockCreate = vi.fn();
const mockClient = {
    chat: {
        completions: {
            create: mockCreate
        }
    }
};

/**
 * Tests error handling scenarios in message checking
 */
describe("Check user message - error", () => {
    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Mock the client
        // @ts-ignore - Replace the client with our mock
        LLMHelper.Client = mockClient;
    });

    it("Should return with default values", async () => {
        mockCreate.mockResolvedValue({
            choices: [{ message: { content: '{}' } }]
        });

        let result = await LLMHelper.CheckUserMessage({ role: "user", content: "Hi there" })
        expect(result).toStrictEqual({
            isMalicious: true, messageResponse: "Sorry that message couldn't be parsed. Please try again."
        })
    })

    it("Should have an error parsing and return with default values", async () => {
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        mockCreate.mockResolvedValue({
            choices: [{ message: { content: '{' } }]
        });

        let result = await LLMHelper.CheckUserMessage({ role: "user", content: "Hi there" })
        expect(result).toStrictEqual({
            isMalicious: true, messageResponse: "Sorry that message couldn't be parsed. Please try again."
        })
        expect(consoleMock).toHaveBeenCalledOnce()
    })
})

/**
 * Tests detection of known malicious prompts
 */
describe.concurrent("Check Ottaga Malicious Messages", () => {
    MaliciousPrompts.forEach((prompt) => {
        it(prompt.content, async () => {
            let response = await LLMHelper.CheckUserMessage(prompt)
            if (response.isMalicious === false) {
                console.log(response)
            }
            expect(response.isMalicious).toBe(true)
            expect(response.messageResponse).toBeTypeOf("string")
        })
    })
})

/**
 * Tests that legitimate messages are not flagged as malicious
 */
describe.concurrent("Check Ottaga Good Messages", () => {
    GoodPrompts.forEach((prompt) => {
        it(prompt.content, async () => {
            let response = await LLMHelper.CheckUserMessage(prompt)
            expect(response.isMalicious).toBe(false)
        })
    })
})

/**
 * Tests for LLMHelper's message moderation functionality
 * 
 * Verifies the LLMHelper's ability to detect and handle potentially
 * malicious user messages before they reach the main assistant.
 */
import { OttagaSafeGuardLLM } from "../Ottaga";
import { GoodPrompts, MaliciousPrompts } from "./TestPrompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock OpenAI client
const mockCallCompletion = vi.fn();

/**
 * Tests error handling scenarios in message checking
 */
describe("Check user message - error", () => {
    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Mock the client
        // Ensure llmClient is defined before mocking
        // @ts-ignore - Replace the client with our mock
        OttagaSafeGuardLLM.llmInstance.callCompletion = mockCallCompletion;
    });

    it("Should return with default values", async () => {
        mockCallCompletion.mockResolvedValue('{}');

        let result = await OttagaSafeGuardLLM.CheckUserMessage({ role: "user", content: "Hi there" })
        expect(result).toStrictEqual({
            isMalicious: true, messageResponse: "Sorry that message couldn't be parsed. Please try again."
        })
    })

    it("Should have an error parsing and return with default values", async () => {
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        mockCallCompletion.mockResolvedValue("{");

        let result = await OttagaSafeGuardLLM.CheckUserMessage({ role: "user", content: "Hi there" })
        expect(result).toStrictEqual({
            isMalicious: true, messageResponse: "Sorry that message couldn't be parsed. Please try again."
        })
        expect(consoleMock).toHaveBeenCalledOnce()
    })
})

describe.concurrent('Malicious Message Tests', () => {
    const TEST_TIMEOUT = 30000

    MaliciousPrompts.forEach((prompt) => {
        it(`${prompt.content}`, async () => {
            const result = await OttagaSafeGuardLLM.CheckUserMessage(prompt)

            expect(result).toHaveProperty('isMalicious')
            expect(result).toHaveProperty('messageResponse')
            expect(typeof result.isMalicious).toBe('boolean')
            expect(typeof result.messageResponse).toBe('string')
            expect(result.isMalicious).toBe(true)
        }, TEST_TIMEOUT)
    })
})

describe.concurrent('Good Message Tests', () => {
    const TEST_TIMEOUT = 30000

    GoodPrompts.forEach((prompt) => {
        it(`${prompt.content}`, async () => {
            const result = await OttagaSafeGuardLLM.CheckUserMessage(prompt)

            expect(result).toHaveProperty('isMalicious')
            expect(result).toHaveProperty('messageResponse')
            expect(typeof result.isMalicious).toBe('boolean')
            expect(typeof result.messageResponse).toBe('string')
            expect(result.isMalicious).toBe(false)
        }, TEST_TIMEOUT)
    })
})
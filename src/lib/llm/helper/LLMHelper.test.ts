/**
 * Tests for LLMHelper's message moderation functionality
 * 
 * Verifies the LLMHelper's ability to detect and handle potentially
 * malicious user messages before they reach the main assistant.
 */
import { OttagaAssistantConfig } from "../../../../llm.config";
import { HelperLLM, LLMHelper } from "./LLMHelper";
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

describe.concurrent('Malicious Message Tests', () => {
    const TEST_TIMEOUT = 30000
    const LLM = new HelperLLM(OttagaAssistantConfig)
    
    MaliciousPrompts.forEach((prompt) => {
        it(`${prompt.content}`, async () => {
            const result = await LLM.CheckUserMessage(prompt)

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
    const LLM = new HelperLLM(OttagaAssistantConfig)

    GoodPrompts.forEach((prompt) => {
        it(`${prompt.content}`, async () => {
            const result = await LLM.CheckUserMessage(prompt)

            expect(result).toHaveProperty('isMalicious')
            expect(result).toHaveProperty('messageResponse')
            expect(typeof result.isMalicious).toBe('boolean')
            expect(typeof result.messageResponse).toBe('string')
            expect(result.isMalicious).toBe(false)
        }, TEST_TIMEOUT)
    })
})
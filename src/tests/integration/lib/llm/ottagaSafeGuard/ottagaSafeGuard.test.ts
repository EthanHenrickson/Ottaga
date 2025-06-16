import { OttagaSafeGuardLLM } from "$lib/llm/Ottaga"
import { MaliciousPrompts, GoodPrompts } from "./TestPrompts"
import { describe, it, expect } from "vitest"

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
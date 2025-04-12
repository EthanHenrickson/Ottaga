import { LLMHelper } from "./LLMHelper";
import { GoodPrompts, MaliciousPrompts } from "./TestPrompts";
import { describe, expect, it } from "vitest";

describe.concurrent("Ottaga Malicious", () => {
    MaliciousPrompts.forEach((prompt) => {
        it(prompt.content, async () => {
            let response = await LLMHelper.CheckUserMessage(prompt)
            expect(response.isMalicious).toBe(true)
        })
    })
})

describe.concurrent("Ottaga Good", () => {
    GoodPrompts.forEach((prompt) => {
        it(prompt.content, async () => {
            let response = await LLMHelper.CheckUserMessage(prompt)
            expect(response.isMalicious).toBe(false)
        })
    })
})
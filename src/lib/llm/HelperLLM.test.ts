import { Helper } from "./HelperLLM";
import { Ottaga } from "./Ottaga";
import { GoodPrompts, MaliciousPrompts } from "./TestPrompts";
import { describe, expect, it, test } from "vitest";

describe.concurrent("Ottaga Malicious", () => {
    MaliciousPrompts.forEach((prompt) => {
        it(prompt.content, async () => {
            let response = await Helper.isMessageMalicious(prompt)
            expect(response).toBe(true)
        })
    })
})

describe.concurrent("Ottaga Good", () => {
    GoodPrompts.forEach((prompt) => {
        it(prompt.content, async () => {
            let response = await Helper.isMessageMalicious(prompt)
            expect(response).toBe(false)
        })
    })
})
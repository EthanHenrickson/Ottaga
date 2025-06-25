import { OttagaHealthLLM } from "$lib/llm/Ottaga"
import type { Message } from "$lib/types"
import { describe, it, expect } from "vitest"

describe("Ottaga Health", () => {
    it("Ensure data can be sent and received", async ()=>{
        let newMessage:Message = {role: "user", content: "Hi there"}
        let OttagaHealthResponse = OttagaHealthLLM.SendMessage([newMessage])

        let resultMessage = ""
        for await (const messageChunk of OttagaHealthResponse) {
            if (messageChunk.success) {
                expect(messageChunk.success).toBeTruthy()
                expect(messageChunk.data).toBeDefined()
                resultMessage += messageChunk.data
            }
        }

        expect(resultMessage.length).toBeGreaterThan(10)
    })
})
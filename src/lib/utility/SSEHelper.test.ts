import { describe, expect, it } from "vitest";
import { DecodeSSE, EncodeToSSE } from "./SSEHelper";

describe("Should encode data", () => {
    it("Should encode a basic JSON", () => {
        const testJSON = `{ a: 1 }`;
        const result = EncodeToSSE(testJSON);
        expect(result).toBe(`data: {"content":"${testJSON}"}\n\n`);
    });

    it("Should encode complex JSON", () => {
        const testJSON = `{ a: 1, b: {a: 1} }`;
        const result = EncodeToSSE(testJSON);
        expect(result).toBe(`data: {"content":"${testJSON}"}\n\n`);
    });

    it("Should handle special characters", () => {
        const testString = `line1\nline2\twith tab`;
        const result = EncodeToSSE(testString);
        expect(result).toBe(`data: {"content":"line1\\nline2\\twith tab"}\n\n`);
    });

    it("Should handle empty content", () => {
        const result = EncodeToSSE("");
        expect(result).toBe(`data: {"content":""}\n\n`);
    });
});

describe("Should decode SSE data", () => {
    // Helper function to convert string to Uint8Array
    const toUint8Array = (str: string) => new TextEncoder().encode(str);

    it("Should decode a basic SSE", () => {
        const testSSE = `data: {"content":"{ a: 1 }"}\n\n`;
        const result = DecodeSSE(toUint8Array(testSSE));
        expect(result[0]).toEqual({ "content": "{ a: 1 }" });
    });

    it("Should decode multiple events", () => {
        const testSSE = `data: {"content":"event1"}\n\ndata: {"content":"event2"}\n\n`;
        const result = DecodeSSE(toUint8Array(testSSE));
        expect(result).toEqual([
            { "content": "event1" },
            { "content": "event2" }
        ]);
    });

    it("Should handle multiline data", () => {
        const testSSE = `data: {"content":"line1\\nline2"}\n\n`;
        const result = DecodeSSE(toUint8Array(testSSE));
        expect(result[0]).toEqual({ "content": "line1\nline2" });
    });
});

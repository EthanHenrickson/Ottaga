/**
 * Generates a Server-Sent Events (SSE) response by formatting the provided data.
 * @param content - The data that will be sent to the front end.
 * @returns A string formatted in SSE format. Example - 'data: {content: contentYouProvide}\n\n'
 */
export function EncodeToSSE(content: string): string {
    return `data: ${JSON.stringify({ content: content })}\n\n`
}

/**
 * Decodes a Server-Sent Events (SSE) chunk and parses its content into an array of data items.
 * Optionally parses JSON content if desired.
 *
 * @param SSEchunk - A Uint8Array containing the raw SSE data.
 * @param options - Configuration options:
 *   - `parseJson` (boolean): If true, parses each stripped chunk as JSON.
 * @returns An array of parsed data items (objects or strings) based on the provided options.
 */
export function DecodeSSE<T = string>(SSEchunk: Uint8Array<ArrayBufferLike>, options: { parseJson?: boolean } = { parseJson: true }): (T)[] {
    const decoder = new TextDecoder();

    // Convert the array to a string using UTF-8 decoding and split the chunks
    const chunks = decoder.decode(SSEchunk).split("\n\n").filter(Boolean);

    return chunks.map((chunk) => {
        const jsonStr = chunk.slice(6);
        return options.parseJson ? JSON.parse(jsonStr) : jsonStr
    })
}
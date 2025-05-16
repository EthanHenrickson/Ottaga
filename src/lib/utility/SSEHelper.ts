/**
 * Generates a Server-Sent Events (SSE) response by formatting the provided data.
 * @param content - The data that will be sent to the front end.
 * @returns A string formatted in SSE format.
 */
export function GenerateSSEResponse(content: string): string {
    return `data: ${JSON.stringify({ content: content })}\n\n`
}

/**
 * Decodes a Server-Sent Events (SSE) chunk and parses its content into an array of data items.
 * Optionally strips the "data: " prefix and parses JSON content.
 *
 * @param SSEchunk - A Uint8Array containing the raw SSE data.
 * @param options - Configuration options:
 *   - `stripDataField` (boolean): If true, removes the "data: " prefix from each chunk.
 *   - `parseJson` (boolean): If true, parses each stripped chunk as JSON.
 * @returns An array of parsed data items (objects or strings) based on the provided options.
 */
export function DecodeSSEandParseContent(SSEchunk: Uint8Array<ArrayBufferLike>, options?: { stripDataField: boolean, parseJson?: boolean }): any[] {
    const decoder = new TextDecoder();

    // Convert the Uint8Array to a string using UTF-8 encoding
    const decodedChunk = decoder.decode(SSEchunk);

    // Split the decoded string into individual SSE data chunks using "\n\n" as the delimiter
    const decodedDataChunkArray = decodedChunk.split("\n\n");

    // Remove the last empty string element resulting from the split operation
    decodedDataChunkArray.pop();

    // If configured to strip the "data: " prefix, process each chunk accordingly
    if (options?.stripDataField) {
        let decodedDataChunkArrayStripped = []
        for (let dataChunk of decodedDataChunkArray) {
            // Remove the "data: " prefix to extract the actual content
            const jsonStr = dataChunk.substring(6);
            if (options.parseJson) {
                // If JSON parsing is enabled, convert the string to a JSON object
                decodedDataChunkArrayStripped.push(JSON.parse(jsonStr))
            } else {
                // Otherwise, return the raw string content
                decodedDataChunkArrayStripped.push(jsonStr)
            }
        }

        return decodedDataChunkArrayStripped
    }

    // If stripping the "data: " field is not enabled, return the raw chunks as strings
    return decodedDataChunkArray
}
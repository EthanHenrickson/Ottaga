/**
 * Generates a Server-Sent Events (SSE) response by formatting the provided data.
 * @param content - The data that will be sent to the front end.
 * @returns A string formatted in SSE format. Example - 'data: {content: contentYouProvide}\n\n'
 */
export function EncodeToSSE(content: string): string {
    return `data: ${JSON.stringify({ content: content })}\n\n`
}

//Overloaded DecodeSSE so we get type handling depending on whether we pass the boolean to parse
export function DecodeSSE(SSEchunk: Uint8Array<ArrayBufferLike>, options: { parseJson: false }): string[];
export function DecodeSSE<T = any>(SSEchunk: Uint8Array<ArrayBufferLike>, options: { parseJson: true }): T[];
export function DecodeSSE<T = any>(SSEchunk: Uint8Array<ArrayBufferLike>): T[];

/**
 * Decodes a Server-Sent Events (SSE) chunk and parses its content into an array of data items.
 * Optionally parses JSON content if desired.
 *
 * @param SSEchunk - A Uint8Array containing the raw SSE data.
 * @param options - Configuration options:
 *   - `parseJson` (boolean): If true, parses each stripped chunk as JSON.
 * @returns An array of parsed data items (objects or strings) based on the provided options.
 */
export function DecodeSSE<T = any>(SSEchunk: Uint8Array<ArrayBufferLike>, options: { parseJson?: boolean } = { parseJson: true }): (T | string)[] {
    const decoder = new TextDecoder();

    // Convert the array to a string using UTF-8 decoding and split the chunks
    const chunks = decoder.decode(SSEchunk).split("\n\n");

    // Remove the last empty string element resulting from the split operation
    chunks.pop();

    let DecodedSSEArray: (string | T)[] = []
    for (let chunk of chunks) {
        //Strip the "data: " prefix to extract the actual content
        const jsonStr = chunk.slice(6);

        //Skip empty data chunks
        if(jsonStr == "") continue;

        if (options.parseJson) {
            DecodedSSEArray.push(JSON.parse(jsonStr) as T)
        } else {
            DecodedSSEArray.push(jsonStr)
        }
    }
    return DecodedSSEArray
}
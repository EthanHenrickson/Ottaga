export type DatabaseResponse = {
    success: boolean;
    message: string;
};

export type DatabaseDataResponse<T> =
    | {
        success: true;
        message: string;
        data: T;
    }
    | {
        success: false;
        message: string;
        data?: undefined;
    };

export type Role = "user" | "assistant" | "system"

export type Message = {
    role: Role,
    content: string
}

export type LLMConfig = {
    baseUrl: string;
    apiKey: string;
    model: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
}

export type MaliciousLLMResponse = {
    isMalicious: boolean,
    messageResponse: string
}

export type CompletionResponse<T> = {
    success: boolean,
    data: T
} | {
    success: false,
}

export type StreamingResponse<T> = {
    success: boolean,
    data: T
} | {
    success: false,
}
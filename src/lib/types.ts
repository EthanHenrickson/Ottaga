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

export type NewUserRecord = {
    firstName: string;
    email: string;
    hashedPassword: string;
    createdDate: number;
};

export type UserRecord = {
    id: string;
    firstName: string;
    email: string;
    hashedPassword: string;
    createdDate: number
    details: string;
    deleted: 0 | 1
}

export type cookie = {
    id: string;
    userID: number;
    expireTime: number;
};

export type Message = {
    role: "user" | "assistant" | "system",
    content: string
}

export type LLMConfig = {
    model: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
}

export type MaliciousLLMResponse = {
    isMalicious: boolean,
    messageResponse: string
}
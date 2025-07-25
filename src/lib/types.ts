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

export type NewUserTableRecord = {
    name?: string;
    email: string;
    hashedPassword: string;
};

export type UserTableRecord = {
    id: string;
    name: string;
    email: string;
    hashedPassword: string;
    created_at: Date;
    details: string;
    deleted: boolean
}

export type ChatTableRecord = {
    id: string
    FK_userID?: string
    title?: string
    description?: string
    created_at: Date
    modifiable: boolean
    deleted: boolean
}

export type CookieTableRecord = {
    id: string;
    FK_userID: string;
    expireTime: number;
};

export type UserSettingsTableRecord = {
    FK_userID: string,
    theme: string,
    receiveCommunityDigest: boolean,
    simplifiedLanguage: boolean,
    reduceMotion: boolean,
    saveConversations: boolean
}

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
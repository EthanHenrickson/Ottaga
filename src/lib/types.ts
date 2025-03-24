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

export type BaseUserRecord = {
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
};

export type UserRecord = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
}

export type cookie = {
    id: string;
    userID: number;
    expireTime: number;
};
export declare class CustomAPIError extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number);
}

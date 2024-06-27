import { CustomAPIError } from "./CustomAPIError";
export declare class BadRequestError extends CustomAPIError {
    message: string;
    constructor(message: string);
}

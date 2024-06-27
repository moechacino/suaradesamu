import { CustomAPIError } from "./CustomAPIError";
export declare class ConflictRequestError extends CustomAPIError {
    message: string;
    constructor(message: string);
}

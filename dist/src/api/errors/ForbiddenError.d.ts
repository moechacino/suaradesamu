import { CustomAPIError } from "./CustomAPIError";
export declare class ForbiddenError extends CustomAPIError {
    message: string;
    constructor(message: string);
}

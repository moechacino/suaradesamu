import { CustomAPIError } from "./CustomAPIError";
export declare class NotFoundError extends CustomAPIError {
    message: string;
    constructor(message: string);
}

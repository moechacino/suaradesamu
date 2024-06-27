import { CustomAPIError } from "./CustomAPIError";
export declare class Unauthenticated extends CustomAPIError {
    message: string;
    constructor(message: string);
}

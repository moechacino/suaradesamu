"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAPIError = void 0;
class CustomAPIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
exports.CustomAPIError = CustomAPIError;

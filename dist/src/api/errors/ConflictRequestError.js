"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictRequestError = void 0;
const CustomAPIError_1 = require("./CustomAPIError");
class ConflictRequestError extends CustomAPIError_1.CustomAPIError {
    constructor(message) {
        super(message, 409);
        this.message = message;
    }
}
exports.ConflictRequestError = ConflictRequestError;

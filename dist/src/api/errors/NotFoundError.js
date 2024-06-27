"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const CustomAPIError_1 = require("./CustomAPIError");
class NotFoundError extends CustomAPIError_1.CustomAPIError {
    constructor(message) {
        super(message, 404);
        this.message = message;
    }
}
exports.NotFoundError = NotFoundError;

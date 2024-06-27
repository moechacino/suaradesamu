"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const CustomAPIError_1 = require("./CustomAPIError");
class ForbiddenError extends CustomAPIError_1.CustomAPIError {
    constructor(message) {
        super(message, 403);
        this.message = message;
    }
}
exports.ForbiddenError = ForbiddenError;

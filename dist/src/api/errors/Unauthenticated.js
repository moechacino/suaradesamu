"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthenticated = void 0;
const CustomAPIError_1 = require("./CustomAPIError");
class Unauthenticated extends CustomAPIError_1.CustomAPIError {
    constructor(message) {
        super(message, 401);
        this.message = message;
    }
}
exports.Unauthenticated = Unauthenticated;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminValidator = void 0;
class adminValidator {
    static login() {
        const schema = {
            body: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                },
            },
        };
        return schema;
    }
}
exports.adminValidator = adminValidator;

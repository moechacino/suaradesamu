"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponder = void 0;
const fast_json_stringify_1 = __importDefault(require("fast-json-stringify"));
const successSchemaObject = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        success: { type: "boolean" },
        data: { type: "object", additionalProperties: true },
        message: { type: "string" },
    },
};
const successSchemaArray = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        success: { type: "boolean" },
        data: { type: "array", additionalProperties: true },
        message: { type: "string" },
    },
};
const errSchema = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        success: { type: "boolean" },
        error: { type: "string" },
    },
};
const successStringifyObject = (0, fast_json_stringify_1.default)(successSchemaObject);
const successStringifyArray = (0, fast_json_stringify_1.default)(successSchemaArray);
const errStringify = (0, fast_json_stringify_1.default)(errSchema);
class ApiResponder {
    static successResponse(reply, statusCode, data, message) {
        const response = {
            statusCode,
            success: true,
            data,
            message,
        };
        if (Array.isArray(data)) {
            reply
                .status(statusCode)
                .type("application/json")
                .send(successStringifyArray(response));
        }
        else {
            reply
                .status(statusCode)
                .type("application/json")
                .send(successStringifyObject(response));
        }
    }
    static errorResponse(reply, statusCode, error) {
        const response = {
            statusCode,
            success: false,
            error,
        };
        reply
            .status(statusCode)
            .type("application/json")
            .send(errStringify(response));
    }
}
exports.ApiResponder = ApiResponder;

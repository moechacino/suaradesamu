import fastJsonStringify from "fast-json-stringify";
import { FastifyReply } from "fastify";
const successSchema = {
  type: "object",
  properties: {
    statusCode: { type: "integer" },
    success: { type: "boolean" },
    data: { type: "object", additionalProperties: true },
    message: { type: "string" },
  },
} as const;

const errSchema = {
  type: "object",
  properties: {
    statusCode: { type: "integer" },
    success: { type: "boolean" },
    error: { type: "string" },
  },
} as const;

const successStringify = fastJsonStringify(successSchema);
const errStringify = fastJsonStringify(errSchema);

export class ApiResponder {
  static successResponse(
    reply: FastifyReply,
    statusCode: number,
    data: object,
    message: string
  ) {
    const response = {
      statusCode,
      success: true,
      data,
      message,
    };
    reply
      .status(statusCode)
      .type("application/json")
      .send(successStringify(response));
  }

  static errorResponse(reply: FastifyReply, statusCode: number, error: string) {
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

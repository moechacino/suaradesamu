import { FastifyReply } from "fastify";
export declare class ApiResponder {
    static successResponse(reply: FastifyReply, statusCode: number, data: object | object[], message: string): void;
    static errorResponse(reply: FastifyReply, statusCode: number, error: string): void;
}

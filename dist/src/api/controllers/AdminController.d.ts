import { FastifyReply, FastifyRequest } from "fastify";
export declare class AdminController {
    static login(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static logout(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

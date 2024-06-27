import { FastifyReply, FastifyRequest } from "fastify";
export declare class VoterController {
    static addVoter(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static register(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static vote(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static getAllVoter(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static getVoter(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

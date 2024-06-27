import { FastifyRequest, FastifyReply } from "fastify";
export declare class VotingController {
    static startVoting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static endVoting(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static getVotingStatus(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static getVotingCount(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

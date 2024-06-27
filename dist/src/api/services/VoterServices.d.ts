import { FastifyRequest } from "fastify";
export declare class VoterService {
    static addVoter(request: FastifyRequest): Promise<object>;
    static getAll(): Promise<object[]>;
    static register(request: FastifyRequest): Promise<any>;
    static vote(request: FastifyRequest): Promise<any>;
    static getVote(request: FastifyRequest): Promise<any>;
}

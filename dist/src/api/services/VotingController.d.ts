import { FastifyRequest } from "fastify";
export declare class VotingService {
    static startVoting(request: FastifyRequest): Promise<{
        votingStatus: any;
        start: Date;
        end: Date;
    }>;
    static endVoting(): Promise<object>;
    static getVotingStatus(): Promise<{
        votingStatus: any;
        start: Date;
        end: Date;
    }>;
    static getVotingCount(): Promise<object>;
}

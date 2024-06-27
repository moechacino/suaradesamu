import { FastifyReply, FastifyRequest } from "fastify";
import { MulterRequest } from "../../types/multerType";
export declare class CandidateController {
    static testCreateAccount(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static create(request: MulterRequest, reply: FastifyReply): Promise<void>;
    static getAll(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static getOne(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static addOrganizationExperience(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static addWorkExperience(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static addEducation(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    static addWorkPlan(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

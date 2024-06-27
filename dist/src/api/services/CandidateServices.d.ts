import { CandidateResponse } from "../models/CandidateModel";
import { MulterRequest } from "../../types/multerType";
import { FastifyRequest } from "fastify";
export declare class CandidateService {
    static create(request: MulterRequest): Promise<CandidateResponse>;
    static addOrganization(request: FastifyRequest): Promise<object>;
    static addWorkExperience(request: FastifyRequest): Promise<object>;
    static addEducation(request: FastifyRequest): Promise<object>;
    static addWorkPlan(request: FastifyRequest): Promise<object>;
    static getOne(id: number): Promise<any>;
    static getAll(): Promise<any>;
    static testCreateAccount(id: number): Promise<any>;
}

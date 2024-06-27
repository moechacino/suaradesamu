import { AdminResponse } from "../models/AdminModel";
import { FastifyRequest } from "fastify";
export declare class AdminService {
    static login(request: FastifyRequest): Promise<AdminResponse>;
    static logout(id: number): Promise<AdminResponse>;
}

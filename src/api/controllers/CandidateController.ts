import { FastifyReply, FastifyRequest } from "fastify";

import { AdminService } from "../services/AdminService";
import { ApiResponder } from "../utils/ApiResponder";
import { CandidateService } from "../services/CandidateServices";
import { BadRequestError } from "../errors/BadRequestError";
import { MulterRequest } from "../../types/multerType";

export class CandidateController {
  static async testCreateAccount(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const id = params.id;
    if (isNaN(Number(id))) {
      throw new BadRequestError("id must be a number");
    }
    const result = await CandidateService.testCreateAccount(parseInt(id));
    console.log(result);
    ApiResponder.successResponse(reply, 200, result, "");
  }

  static async create(request: MulterRequest, reply: FastifyReply) {
    const { name, age } = request.body as { name: string; age: string };
    if (!name || !age) {
      throw new BadRequestError("field 'name' and 'age' is required");
    }
    if (isNaN(Number(age))) {
      throw new BadRequestError("age must be number");
    }
    const result = await CandidateService.create(request);
    ApiResponder.successResponse(reply, 200, result, "");
  }

  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await CandidateService.getAll();
    ApiResponder.successResponse(reply, 200, result, "");
  }
  static async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    if (isNaN(Number(id))) {
      throw new BadRequestError("id must be a number");
    }
    const result = await CandidateService.getOne(parseInt(id));
    ApiResponder.successResponse(reply, 200, result, "");
  }

  static async addOrganizationExperience(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const result = await CandidateService.addOrganization(request);
    ApiResponder.successResponse(reply, 201, result, "");
  }

  static async addWorkExperience(request: FastifyRequest, reply: FastifyReply) {
    const result = await CandidateService.addWorkExperience(request);
    ApiResponder.successResponse(reply, 201, result, "");
  }
  static async addEducation(request: FastifyRequest, reply: FastifyReply) {
    const result = await CandidateService.addEducation(request);
    ApiResponder.successResponse(reply, 201, result, "");
  }
  static async addWorkPlan(request: FastifyRequest, reply: FastifyReply) {
    const result = await CandidateService.addWorkPlan(request);
    ApiResponder.successResponse(reply, 201, result, "");
  }
}

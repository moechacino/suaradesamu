import { FastifyReply, FastifyRequest } from "fastify";

import { AdminService } from "../services/AdminService";
import { ApiResponder } from "../utils/ApiResponder";
import { CandidateService } from "../services/CandidateServices";
import { BadRequestError } from "../errors/BadRequestError";

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

  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await CandidateService.getAll();
    ApiResponder.successResponse(reply, 200, result, "");
  }
}

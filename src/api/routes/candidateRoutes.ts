import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CustomAPIError } from "../errors/CustomAPIError";
import { candidateValidator } from "../validators/candidateValidator";
import { CandidateController } from "../controllers/CandidateController";

const createValidator: object = candidateValidator.create();
async function candidateRoutes(fastify: FastifyInstance) {
  try {
    // fastify.post(
    //   "/create",
    //   {
    //     schema: createValidator,
    //   },
    //   AdminController.login
    // );

    fastify.post("/:id", CandidateController.testCreateAccount);
    fastify.get("/", CandidateController.getAll);
  } catch (error) {
    throw new CustomAPIError(error as string, 500);
  }
}

export default candidateRoutes;

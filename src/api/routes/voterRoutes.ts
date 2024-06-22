import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CustomAPIError } from "../errors/CustomAPIError";
import { candidateValidator } from "../validators/candidateValidator";
import { CandidateController } from "../controllers/CandidateController";
import { VoterValidator } from "../validators/voterValidator";
import { VoterController } from "../controllers/VoterController";

const registerValidator: object = VoterValidator.register();
const voteValidator: object = VoterValidator.vote();
const getVoteValidator: object = VoterValidator.getVote();
async function voterRoutes(fastify: FastifyInstance) {
  try {
    fastify.post(
      "/register",
      {
        schema: registerValidator,
      },
      VoterController.register
    );
    fastify.post(
      "/vote",
      {
        schema: voteValidator,
      },
      VoterController.vote
    );
    fastify.post(
      "/search",
      {
        schema: getVoteValidator,
      },
      VoterController.getVoter
    );
  } catch (error) {
    throw new CustomAPIError(error as string, 500);
  }
}

export default voterRoutes;

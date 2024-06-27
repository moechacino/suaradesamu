"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomAPIError_1 = require("../errors/CustomAPIError");
const VotingController_1 = require("../controllers/VotingController");
const votingValidator_1 = require("../validators/votingValidator");
const startVotingValidation = votingValidator_1.VotingValidator.startVoting();
function votingRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fastify.post("/start", {
                schema: startVotingValidation,
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, VotingController_1.VotingController.startVoting);
            fastify.post("/end", {
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, VotingController_1.VotingController.endVoting);
            fastify.get("/status", VotingController_1.VotingController.getVotingStatus);
            fastify.get("/real-count", VotingController_1.VotingController.getVotingCount);
        }
        catch (error) {
            throw new CustomAPIError_1.CustomAPIError(error, 500);
        }
    });
}
exports.default = votingRoutes;

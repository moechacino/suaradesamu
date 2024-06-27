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
const voterValidator_1 = require("../validators/voterValidator");
const VoterController_1 = require("../controllers/VoterController");
const registerValidator = voterValidator_1.VoterValidator.register();
const voteValidator = voterValidator_1.VoterValidator.vote();
const getVoteValidator = voterValidator_1.VoterValidator.getVote();
const addVoterValidation = voterValidator_1.VoterValidator.addVoter();
function voterRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fastify.post("/", {
                schema: addVoterValidation,
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, VoterController_1.VoterController.addVoter);
            fastify.post("/register", {
                schema: registerValidator,
            }, VoterController_1.VoterController.register);
            fastify.post("/vote", {
                schema: voteValidator,
            }, VoterController_1.VoterController.vote);
            fastify.post("/search", {
                schema: getVoteValidator,
            }, VoterController_1.VoterController.getVoter);
            fastify.get("/", {
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, VoterController_1.VoterController.getAllVoter);
        }
        catch (error) {
            throw new CustomAPIError_1.CustomAPIError(error, 500);
        }
    });
}
exports.default = voterRoutes;

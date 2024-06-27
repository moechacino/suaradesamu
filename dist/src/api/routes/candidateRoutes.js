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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomAPIError_1 = require("../errors/CustomAPIError");
const CandidateController_1 = require("../controllers/CandidateController");
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const multer_1 = __importDefault(require("../plugins/multer"));
const candidateValidator_1 = require("../validators/candidateValidator");
const createOrganizationValidation = candidateValidator_1.CandidateValidator.createOrganization();
const createWorkExperienceValidation = candidateValidator_1.CandidateValidator.createWorkExperience();
const createEducationValidation = candidateValidator_1.CandidateValidator.createEducation();
const createWorkPlanValidation = candidateValidator_1.CandidateValidator.createWorkPlan();
function candidateRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fastify.post("/:id", CandidateController_1.CandidateController.testCreateAccount);
            fastify.get("/", CandidateController_1.CandidateController.getAll);
            fastify.get("/:id", CandidateController_1.CandidateController.getOne);
            fastify.post("/create", {
                preHandler: (0, fastify_multer_1.default)(multer_1.default).single("file"),
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, CandidateController_1.CandidateController.create);
            fastify.post("/organization/:id", {
                schema: createOrganizationValidation,
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, CandidateController_1.CandidateController.addOrganizationExperience);
            fastify.post("/work-experience/:id", {
                schema: createWorkExperienceValidation,
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, CandidateController_1.CandidateController.addWorkExperience);
            fastify.post("/education/:id", {
                schema: createEducationValidation,
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, CandidateController_1.CandidateController.addEducation);
            fastify.post("/work-plan/:id", {
                schema: createWorkPlanValidation,
                onRequest: (request, reply) => fastify.authenticate(request, reply),
            }, CandidateController_1.CandidateController.addWorkPlan);
        }
        catch (error) {
            throw new CustomAPIError_1.CustomAPIError(error, 500);
        }
    });
}
exports.default = candidateRoutes;

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
exports.CandidateController = void 0;
const ApiResponder_1 = require("../utils/ApiResponder");
const CandidateServices_1 = require("../services/CandidateServices");
const BadRequestError_1 = require("../errors/BadRequestError");
class CandidateController {
    static testCreateAccount(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = request.params;
            const id = params.id;
            if (isNaN(Number(id))) {
                throw new BadRequestError_1.BadRequestError("id must be a number");
            }
            const result = yield CandidateServices_1.CandidateService.testCreateAccount(parseInt(id));
            console.log(result);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, age, noUrut } = request.body;
            if (!name || !age || !noUrut) {
                throw new BadRequestError_1.BadRequestError("field 'name' , 'noUrut', and 'age' is required");
            }
            if (isNaN(Number(age))) {
                throw new BadRequestError_1.BadRequestError("age must be number");
            }
            if (isNaN(Number(noUrut))) {
                throw new BadRequestError_1.BadRequestError("age must be number");
            }
            if (!request.file || !request.file.fieldname) {
                throw new BadRequestError_1.BadRequestError("insert photo profile as file");
            }
            const result = yield CandidateServices_1.CandidateService.create(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static getAll(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CandidateServices_1.CandidateService.getAll();
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static getOne(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            if (isNaN(Number(id))) {
                throw new BadRequestError_1.BadRequestError("id must be a number");
            }
            const result = yield CandidateServices_1.CandidateService.getOne(parseInt(id));
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static addOrganizationExperience(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CandidateServices_1.CandidateService.addOrganization(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 201, result, "");
        });
    }
    static addWorkExperience(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CandidateServices_1.CandidateService.addWorkExperience(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 201, result, "");
        });
    }
    static addEducation(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CandidateServices_1.CandidateService.addEducation(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 201, result, "");
        });
    }
    static addWorkPlan(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CandidateServices_1.CandidateService.addWorkPlan(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 201, result, "");
        });
    }
}
exports.CandidateController = CandidateController;

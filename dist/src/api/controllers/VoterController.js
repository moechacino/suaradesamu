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
exports.VoterController = void 0;
const VoterServices_1 = require("../services/VoterServices");
const ApiResponder_1 = require("../utils/ApiResponder");
class VoterController {
    static addVoter(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VoterServices_1.VoterService.addVoter(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 201, result, "");
        });
    }
    static register(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VoterServices_1.VoterService.register(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 201, result, "");
        });
    }
    static vote(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VoterServices_1.VoterService.vote(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static getAllVoter(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VoterServices_1.VoterService.getAll();
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static getVoter(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VoterServices_1.VoterService.getVote(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
}
exports.VoterController = VoterController;

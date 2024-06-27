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
exports.VotingController = void 0;
const VotingController_1 = require("../services/VotingController");
const ApiResponder_1 = require("../utils/ApiResponder");
class VotingController {
    static startVoting(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VotingController_1.VotingService.startVoting(request);
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "Voting has been started");
        });
    }
    static endVoting(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VotingController_1.VotingService.endVoting();
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "Voting has been ended");
        });
    }
    static getVotingStatus(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VotingController_1.VotingService.getVotingStatus();
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
    static getVotingCount(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield VotingController_1.VotingService.getVotingCount();
            ApiResponder_1.ApiResponder.successResponse(reply, 200, result, "");
        });
    }
}
exports.VotingController = VotingController;

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
exports.VotingService = void 0;
const web3_1 = require("../../config/web3");
const BadRequestError_1 = require("../errors/BadRequestError");
const database_1 = require("../../config/database");
class VotingService {
    static startVoting(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { durationInMiliseconds } = request.body;
            if (isNaN(Number(durationInMiliseconds))) {
                throw new BadRequestError_1.BadRequestError("id must be number");
            }
            yield web3_1.votingContract.methods.checkIsVotingEnd().send({
                from: web3_1.contractOwner,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
            });
            const data = yield web3_1.votingContract.methods
                .startVoting(parseInt(durationInMiliseconds))
                .encodeABI();
            const tx = {
                from: web3_1.contractOwner,
                to: web3_1.contractAddress,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
                data: data,
            };
            const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, web3_1.contractOwnerPkey || "FAKE PKEY");
            const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            const votingStatus = yield web3_1.votingContract.methods.getVotingStatus().call();
            const doesVotingRun = votingStatus["0"];
            const start = new Date(Number(BigInt(votingStatus["1"])) * 1000);
            const end = new Date(Number(BigInt(votingStatus["2"])) * 1000);
            const formattedVotingStatus = {
                votingStatus: doesVotingRun,
                start: start,
                end: end,
            };
            return formattedVotingStatus;
        });
    }
    static endVoting() {
        return __awaiter(this, void 0, void 0, function* () {
            yield web3_1.votingContract.methods.checkIsVotingEnd().send({
                from: web3_1.contractOwner,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
            });
            const data = yield web3_1.votingContract.methods.endVoting().encodeABI();
            const tx = {
                from: web3_1.contractOwner,
                to: web3_1.contractAddress,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
                data: data,
            };
            const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, web3_1.contractOwnerPkey || "FAKE PKEY");
            const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            const votingStatus = yield web3_1.votingContract.methods.getVotingStatus().call();
            const doesVotingRun = votingStatus["0"];
            const start = new Date(Number(BigInt(votingStatus["1"])) * 1000);
            const end = new Date(Number(BigInt(votingStatus["2"])) * 1000);
            const formattedVotingStatus = {
                votingStatus: doesVotingRun,
                start: start,
                end: end,
            };
            return formattedVotingStatus;
        });
    }
    static getVotingStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            yield web3_1.votingContract.methods.checkIsVotingEnd().send({
                from: web3_1.contractOwner,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
            });
            const votingStatus = yield web3_1.votingContract.methods.getVotingStatus().call();
            console.log(votingStatus);
            const doesVotingRun = votingStatus["0"];
            const start = new Date(Number(BigInt(votingStatus["1"])) * 1000);
            const end = new Date(Number(BigInt(votingStatus["2"])) * 1000);
            const formattedVotingStatus = {
                votingStatus: doesVotingRun,
                start: start,
                end: end,
            };
            return formattedVotingStatus;
        });
    }
    static getVotingCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const voterCount = yield web3_1.votingContract.methods.getVoterCount().call();
            const formattedVoterCount = parseInt(web3_1.web3.utils.toBigInt(voterCount).toString());
            console.log(formattedVoterCount);
            const votesCount = yield web3_1.votingContract.methods.getVotesCount().call();
            const formattedVotesCount = parseInt(web3_1.web3.utils.toBigInt(votesCount).toString());
            const inPersen = Math.round((formattedVotesCount / formattedVoterCount) * 100 * 10) / 10;
            yield web3_1.votingContract.methods.checkIsVotingEnd().send({
                from: web3_1.contractOwner,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
            });
            const votingStatus = yield web3_1.votingContract.methods.getVotingStatus().call();
            const doesVotingRun = votingStatus["0"];
            const end = new Date(Number(BigInt(votingStatus["2"])) * 1000);
            const nowDate = new Date();
            let data = [];
            const candidates = yield database_1.prismaClient.candidate.findMany({
                select: {
                    id: true,
                    noUrut: true,
                    name: true,
                },
            });
            if (nowDate > end || !doesVotingRun) {
                for (const val of candidates) {
                    const candidate = yield web3_1.votingContract.methods.getCandidate(val.id).call();
                    const candidateId = candidate["0"].toString();
                    const candidateName = candidate["1"];
                    const voteCount = candidate["2"].toString();
                    const formattedCandidates = {
                        id: candidateId,
                        name: candidateName,
                        voteCount: voteCount,
                    };
                    data.push({
                        id: val.id,
                        name: formattedCandidates.name,
                        voteCount: parseInt(formattedCandidates.voteCount),
                        noUrut: parseInt(formattedCandidates.id),
                    });
                }
            }
            return {
                totalPemilih: formattedVoterCount,
                totalSuaraMasuk: formattedVotesCount,
                totalSuaraMasukDalamPersen: inPersen,
                isVotingRun: doesVotingRun,
                candidatesData: candidates,
                candidateVotesCount: data,
            };
        });
    }
}
exports.VotingService = VotingService;

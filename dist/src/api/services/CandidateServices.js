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
exports.CandidateService = void 0;
const database_1 = require("../../config/database");
const web3_1 = require("../../config/web3");
const NotFoundError_1 = require("../errors/NotFoundError");
const CandidateModel_1 = require("../models/CandidateModel");
const BadRequestError_1 = require("../errors/BadRequestError");
class CandidateService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = request.body;
            const file = request.file;
            const transaction = yield database_1.prismaClient.$transaction((prismaClient) => __awaiter(this, void 0, void 0, function* () {
                const candidate = yield prismaClient.candidate.create({
                    data: {
                        name: createRequest.name,
                        age: parseInt(createRequest.age.toString()),
                        noUrut: parseInt(createRequest.noUrut.toString()),
                        photoProfileAlt: file.filename,
                        photoProfileUrl: `https://dory-liberal-uniformly.ngrok-free.app/profile/${file.filename}`,
                    },
                });
                if (candidate) {
                    const data = yield web3_1.votingContract.methods
                        .addCandidate(candidate.name, candidate.noUrut)
                        .encodeABI();
                    const tx = {
                        from: web3_1.contractOwner,
                        to: web3_1.contractAddress,
                        gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
                        data: data,
                    };
                    const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, web3_1.contractOwnerPkey || "FAKE PKEY");
                    const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                }
                return { candidate };
            }));
            return (0, CandidateModel_1.toCandidateResponse)(transaction["candidate"]);
        });
    }
    static addOrganization(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            if (isNaN(Number(id))) {
                throw new BadRequestError_1.BadRequestError("id must be number");
            }
            const organizationRequest = request.body;
            const organization = yield database_1.prismaClient.organizationExperience.create({
                data: {
                    candidate: { connect: { id: parseInt(id) } },
                    title: organizationRequest.title,
                    periodStart: new Date(organizationRequest.periodStart),
                    periodEnd: organizationRequest.periodEnd
                        ? new Date(organizationRequest.periodEnd)
                        : null,
                },
            });
            return organization;
        });
    }
    static addWorkExperience(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            if (isNaN(Number(id))) {
                throw new BadRequestError_1.BadRequestError("id must be number");
            }
            const workExperienceRequest = request.body;
            const workExperience = yield database_1.prismaClient.workExperience.create({
                data: {
                    candidate: { connect: { id: parseInt(id) } },
                    title: workExperienceRequest.title,
                    periodStart: new Date(workExperienceRequest.periodStart),
                    periodEnd: workExperienceRequest.periodEnd
                        ? new Date(workExperienceRequest.periodEnd)
                        : null,
                },
            });
            return workExperience;
        });
    }
    static addEducation(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            if (isNaN(Number(id))) {
                throw new BadRequestError_1.BadRequestError("id must be number");
            }
            const educationRequest = request.body;
            const education = yield database_1.prismaClient.education.create({
                data: {
                    candidate: { connect: { id: parseInt(id) } },
                    degree: educationRequest.degree,
                    institution: educationRequest.institution,
                    periodStart: new Date(educationRequest.periodStart),
                    periodEnd: educationRequest.periodEnd
                        ? new Date(educationRequest.periodEnd)
                        : null,
                },
            });
            return education;
        });
    }
    static addWorkPlan(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            if (isNaN(Number(id))) {
                throw new BadRequestError_1.BadRequestError("id must be number");
            }
            const workPlanRequest = request.body;
            const workPlan = yield database_1.prismaClient.workPlan.create({
                data: {
                    candidate: { connect: { id: parseInt(id) } },
                    title: workPlanRequest.title,
                    detail: workPlanRequest.detail,
                },
            });
            return workPlan;
        });
    }
    static getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield database_1.prismaClient.candidate.findUnique({
                where: {
                    id: id,
                },
                include: {
                    organization: {
                        select: {
                            id: true,
                            title: true,
                            periodStart: true,
                            periodEnd: true,
                        },
                    },
                    workExperience: {
                        select: {
                            id: true,
                            title: true,
                            periodStart: true,
                            periodEnd: true,
                        },
                    },
                    workPlan: {
                        select: {
                            id: true,
                            title: true,
                            detail: true,
                        },
                    },
                    education: {
                        select: {
                            id: true,
                            degree: true,
                            institution: true,
                            periodStart: true,
                            periodEnd: true,
                        },
                    },
                },
            });
            return candidate;
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const candidates = yield database_1.prismaClient.candidate.findMany({
                include: {
                    organization: {
                        select: {
                            id: true,
                            title: true,
                            periodStart: true,
                            periodEnd: true,
                        },
                    },
                    workExperience: {
                        select: {
                            id: true,
                            title: true,
                            periodStart: true,
                            periodEnd: true,
                        },
                    },
                    workPlan: {
                        select: {
                            id: true,
                            title: true,
                            detail: true,
                        },
                    },
                    education: {
                        select: {
                            id: true,
                            degree: true,
                            institution: true,
                            periodStart: true,
                            periodEnd: true,
                        },
                    },
                },
            });
            // const data = [];
            // for (const val of candidates) {
            //   const candidate: {
            //     "0": string;
            //     "1": string;
            //     "2": string;
            //     __length__: number;
            //   } = await votingContract.methods.getCandidate(val.id).call();
            //   const candidateId = candidate["0"].toString();
            //   const candidateName = candidate["1"];
            //   const voteCount = candidate["2"].toString();
            //   const formattedCandidates = {
            //     id: candidateId,
            //     name: candidateName,
            //     voteCount: voteCount,
            //   };
            //   data.push({
            //     db: val,
            //     blockchain: formattedCandidates,
            //   });
            // }
            return candidates;
        });
    }
    static testCreateAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield database_1.prismaClient.candidate.findUnique({
                where: {
                    id: id,
                },
            });
            if (!candidate) {
                throw new NotFoundError_1.NotFoundError("candidate not found");
            }
            const data = yield web3_1.votingContract.methods
                .addCandidate(candidate.name, candidate.id)
                .encodeABI();
            const tx = {
                from: web3_1.contractOwner,
                to: web3_1.contractAddress,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
                data: data,
            };
            if (web3_1.contractOwnerPkey) {
                const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, web3_1.contractOwnerPkey);
                const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                return receipt.transactionHash;
            }
            else {
                return false;
            }
        });
    }
}
exports.CandidateService = CandidateService;

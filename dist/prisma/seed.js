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
const database_1 = require("../src/config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const voter_1 = require("./dump/voter");
const candidate_1 = require("./dump/candidate");
const web3_1 = require("../src/config/web3");
const addAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield database_1.prismaClient.admin.findUnique({
        where: {
            username: "admin1",
        },
    });
    if (!isExist) {
        const username = "admin";
        const password = yield bcrypt_1.default.hash("suaradesamu", 10);
        yield database_1.prismaClient.admin.create({
            data: {
                username: username,
                password: password,
            },
        });
    }
});
const addVoterAndPin = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const val of voter_1.dumpVoter) {
        const createdVoter = yield database_1.prismaClient.voter.create({
            data: {
                nfcSerialNumber: val.nfsSerialNumber,
                name: val.name,
                NIK: val.NIK,
            },
        });
        const data = yield web3_1.votingContract.methods
            .addNIK(createdVoter.NIK)
            .encodeABI();
        const tx = {
            from: web3_1.contractOwner,
            to: web3_1.contractAddress,
            gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
            data: data,
        };
        const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, web3_1.contractOwnerPkey || "FAKE_PKEY");
        const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        yield database_1.prismaClient.pin.create({
            data: {
                pinCode: val.PIN,
                voterId: createdVoter.id,
            },
        });
    }
});
const addCandidate = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const val of candidate_1.candidateData) {
        const candidate = yield database_1.prismaClient.candidate.create({
            data: {
                name: val.name,
                age: val.age,
                noUrut: val.noUrut,
                photoProfileAlt: val.photoProfileAlt,
                photoProfileUrl: val.photoProfileUrl,
            },
        });
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
        }
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield addAdmin();
        yield addVoterAndPin();
        yield addCandidate();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    finally {
        yield database_1.prismaClient.$disconnect;
    }
}))();

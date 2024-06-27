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
exports.VoterService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../../config/database");
const ForbiddenError_1 = require("../errors/ForbiddenError");
const web3_1 = require("../../config/web3");
const BadRequestError_1 = require("../errors/BadRequestError");
const ConflictRequestError_1 = require("../errors/ConflictRequestError");
const cryptoAlgorithm = "aes-128-cbc";
const key = "1SuaraDesaMuPkey1";
const iv = "1234567890123456";
function generateKeyFromPassword(password) {
    return crypto_1.default.pbkdf2Sync(password, "salt", 10000, 16, "sha256");
}
function encrypt(text, chiperKey) {
    const ckey = chiperKey || key;
    const usedKey = generateKeyFromPassword(ckey);
    let cipher = crypto_1.default.createCipheriv(cryptoAlgorithm, usedKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}
function decrypt(encryptedText, chiperKey) {
    const ckey = chiperKey || key;
    let decipher = crypto_1.default.createDecipheriv(cryptoAlgorithm, ckey, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
class VoterService {
    static addVoter(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nik, nfcSN, name } = request.body;
            console.log(typeof nik);
            const isExist = yield database_1.prismaClient.voter.findFirst({
                where: {
                    OR: [{ nfcSerialNumber: nfcSN }, { NIK: nik }],
                },
            });
            if (isExist) {
                throw new ConflictRequestError_1.ConflictRequestError("NIK or NFC Serial Number is already registered");
            }
            yield web3_1.votingContract.methods.checkIfNIKNotRegistered(nik).call();
            const transaction = yield database_1.prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                const voter = yield prisma.voter.create({
                    data: {
                        name: name,
                        nfcSerialNumber: nfcSN,
                        NIK: nik,
                    },
                });
                const data = yield web3_1.votingContract.methods.addNIK(nik).encodeABI();
                const tx = {
                    from: web3_1.contractOwner,
                    to: web3_1.contractAddress,
                    gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
                    data: data,
                };
                const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, web3_1.contractOwnerPkey || "FAKE_PKEY");
                const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                return {
                    voter,
                    transactionHash: receipt.transactionHash,
                };
            }));
            return {
                addedNIK: transaction["voter"],
                transactionHash: transaction["transactionHash"],
            };
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield web3_1.votingContract.methods.getAllNIKs().call();
            const voters = [];
            for (const val of data) {
                const voter = yield database_1.prismaClient.voter.findUnique({
                    where: {
                        NIK: val,
                    },
                    select: {
                        id: true,
                        name: true,
                        NIK: true,
                        nfcSerialNumber: true,
                    },
                });
                if (voter) {
                    voters.push(voter);
                }
            }
            return voters;
        });
    }
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            web3_1.votingContract.accountProvider;
            const voterRegisterRequest = request.body;
            const voter = yield database_1.prismaClient.voter.findUnique({
                where: {
                    nfcSerialNumber: voterRegisterRequest.nfcSN,
                },
                include: {
                    pin: {
                        select: {
                            pinCode: true,
                        },
                    },
                },
            });
            if (!voter || voterRegisterRequest.pin !== ((_a = voter.pin) === null || _a === void 0 ? void 0 : _a.pinCode)) {
                throw new ForbiddenError_1.ForbiddenError("Anda Tidak Memiliki Hak Pilih");
            }
            return voter;
        });
    }
    static vote(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const voterVoteRequest = request.body;
            const voter = yield database_1.prismaClient.voter.findUnique({
                where: {
                    NIK: voterVoteRequest.nik,
                },
                include: {
                    pin: {
                        select: {
                            pinCode: true,
                        },
                    },
                },
            });
            if (!voter) {
                throw new BadRequestError_1.BadRequestError("NIK Tidak Terdaftar");
            }
            const candidate = yield database_1.prismaClient.candidate.findUnique({
                where: {
                    id: parseInt(voterVoteRequest.candidateId.toString()),
                },
                select: {
                    name: true,
                    noUrut: true,
                },
            });
            yield web3_1.votingContract.methods.checkIfNIKRegistered(voter.NIK).call();
            yield web3_1.votingContract.methods
                .checkIfCandidateValid(candidate === null || candidate === void 0 ? void 0 : candidate.noUrut)
                .call();
            const newAccount = web3_1.web3.eth.accounts.create();
            const account = web3_1.web3.eth.accounts.privateKeyToAccount(newAccount.privateKey);
            const data = web3_1.votingContract.methods
                .vote(candidate === null || candidate === void 0 ? void 0 : candidate.noUrut, voter.NIK)
                .encodeABI();
            yield web3_1.web3.eth.sendTransaction({
                from: web3_1.contractOwner,
                to: account.address,
                value: web3_1.web3.utils.toWei("0.2", "ether"),
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
            });
            console.log(account);
            const thisBalance = yield web3_1.web3.eth.getBalance(account.address);
            console.log(`balance: ${thisBalance}`);
            const tx = {
                from: account.address,
                to: web3_1.contractAddress,
                gasPrice: web3_1.web3.utils.toWei("10", "gwei"),
                data: data,
            };
            const signedTx = yield web3_1.web3.eth.accounts.signTransaction(tx, newAccount.privateKey);
            const receipt = yield web3_1.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            return {
                address: newAccount.address,
                pkey: newAccount.privateKey,
                transaction: receipt.transactionHash,
            };
        });
    }
    static getVote(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { privateKey } = request.body;
            const account = yield web3_1.web3.eth.accounts.privateKeyToAccount(privateKey);
            console.log(account.address);
            const voteData = yield web3_1.votingContract.methods.getVoter().call({ from: account.address });
            const hasVoted = voteData["0"];
            const candidateId = voteData["1"].toString();
            const NIK = voteData["2"].toString();
            const candidate = yield database_1.prismaClient.candidate.findUnique({
                where: { id: parseInt(candidateId) },
                select: {
                    id: true,
                    name: true,
                    noUrut: true,
                },
            });
            const formattedData = {
                hasVoted: hasVoted,
                votedCandidate: candidate === null || candidate === void 0 ? void 0 : candidate.noUrut,
                votedCandidateName: candidate === null || candidate === void 0 ? void 0 : candidate.name,
                NIK: NIK,
            };
            return formattedData;
        });
    }
}
exports.VoterService = VoterService;

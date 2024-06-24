import crypto from "crypto";
import { FastifyRequest } from "fastify";
import {
  VoterRegisterRequest,
  VoterVoteRequest,
  toVoterResponse,
} from "../models/VoterModel";
import { prismaClient } from "../../config/database";
import { ForbiddenError } from "../errors/ForbiddenError";
import {
  contractAddress,
  contractOwner,
  contractOwnerPkey,
  votingContract,
  web3,
} from "../../config/web3";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictRequestError } from "../errors/ConflictRequestError";
const cryptoAlgorithm = "aes-128-cbc";
const key = "1SuaraDesaMuPkey1";
const iv = "1234567890123456";

function generateKeyFromPassword(password: string): Buffer {
  return crypto.pbkdf2Sync(password, "salt", 10000, 16, "sha256");
}

function encrypt(text: string, chiperKey: string) {
  const ckey = chiperKey || key;
  const usedKey = generateKeyFromPassword(ckey);
  let cipher = crypto.createCipheriv(cryptoAlgorithm, usedKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}
function decrypt(encryptedText: string, chiperKey: string) {
  const ckey = chiperKey || key;
  let decipher = crypto.createDecipheriv(cryptoAlgorithm, ckey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
export class VoterService {
  static async addVoter(request: FastifyRequest): Promise<object> {
    const { nik, nfcSN, name } = request.body as {
      nik: string;
      nfcSN: string;
      name: string;
    };
    console.log(typeof nik);
    const isExist = await prismaClient.voter.findFirst({
      where: {
        OR: [{ nfcSerialNumber: nfcSN }, { NIK: nik }],
      },
    });

    if (isExist) {
      throw new ConflictRequestError(
        "NIK or NFC Serial Number is already registered"
      );
    }
    await votingContract.methods.checkIfNIKNotRegistered(nik).call();

    const transaction = await prismaClient.$transaction(async (prisma) => {
      const voter = await prisma.voter.create({
        data: {
          name: name,
          nfcSerialNumber: nfcSN,
          NIK: nik,
        },
      });
      const data = await votingContract.methods.addNIK(nik).encodeABI();

      const tx = {
        from: contractOwner,
        to: contractAddress,
        gasPrice: web3.utils.toWei("10", "gwei"),
        data: data,
      };

      const signedTx = await web3.eth.accounts.signTransaction(
        tx,
        contractOwnerPkey || "FAKE_PKEY"
      );

      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return {
        voter,
        transactionHash: receipt.transactionHash,
      };
    });

    return {
      addedNIK: transaction["voter"],
      transactionHash: transaction["transactionHash"],
    };
  }

  static async getAll(): Promise<object[]> {
    const data: [] = await votingContract.methods.getAllNIKs().call();
    const voters: object[] = [];
    for (const val of data) {
      const voter = await prismaClient.voter.findUnique({
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
  }

  static async register(request: FastifyRequest): Promise<any> {
    votingContract.accountProvider;
    const voterRegisterRequest: VoterRegisterRequest =
      request.body as VoterRegisterRequest;

    const voter = await prismaClient.voter.findUnique({
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

    if (!voter || voterRegisterRequest.pin !== voter.pin?.pinCode) {
      throw new ForbiddenError("Anda Tidak Memiliki Hak Pilih");
    }

    return voter;
  }

  static async vote(request: FastifyRequest): Promise<any> {
    const voterVoteRequest: VoterVoteRequest = request.body as VoterVoteRequest;
    const voter = await prismaClient.voter.findUnique({
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
      throw new BadRequestError("NIK Tidak Terdaftar");
    }

    await votingContract.methods.checkIfNIKRegistered(voter.NIK).call();
    await votingContract.methods
      .checkIfCandidateValid(voterVoteRequest.candidateId)
      .call();

    const newAccount = web3.eth.accounts.create();
    const account = web3.eth.accounts.privateKeyToAccount(
      newAccount.privateKey
    );
    const data = votingContract.methods
      .vote(voterVoteRequest.candidateId, voter.NIK)
      .encodeABI();

    await web3.eth.sendTransaction({
      from: contractOwner,
      to: account.address,
      value: web3.utils.toWei("0.2", "ether"),
      gasPrice: web3.utils.toWei("10", "gwei"),
    });

    console.log(account);
    const thisBalance = await web3.eth.getBalance(account.address);
    console.log(`balance: ${thisBalance}`);
    const tx = {
      from: account.address,
      to: contractAddress,
      gasPrice: web3.utils.toWei("10", "gwei"),
      data: data,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      newAccount.privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    return {
      address: newAccount.address,
      pkey: newAccount.privateKey,
      transaction: receipt.transactionHash,
    };
  }

  static async getVote(request: FastifyRequest): Promise<any> {
    const { privateKey } = request.body as {
      privateKey: string;
    };
    const account = await web3.eth.accounts.privateKeyToAccount(privateKey);

    const voteData: {
      "0": string;
      "1": string;
      "2": string;
    } = await votingContract.methods.getVoter(account.address).call();

    const hasVoted = voteData["0"];
    const candidateId = voteData["1"].toString();
    const NIK = voteData["2"].toString();

    const candidate = await prismaClient.candidate.findUnique({
      where: { id: parseInt(candidateId) },
      select: {
        id: true,
        name: true,
      },
    });

    const formattedData = {
      hasVoted: hasVoted,
      votedCandidateId: candidate?.id,
      votedCandidateName: candidate?.name,
      NIK: NIK,
    };

    return formattedData;
  }
}

import crypto, { createHash } from "crypto";
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
import xlsx from "xlsx";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictRequestError } from "../errors/ConflictRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { MulterRequest } from "../../types/multerType";
import { File } from "fastify-multer/lib/interfaces";
import bcrypt from "bcrypt";
const cryptoAlgorithm = "aes-128-cbc";
const key = "1SuaraDesaMuPkey1";
const iv = "1234567890123456";

function generateKeyFromPassword(password: string): Buffer {
  return crypto.pbkdf2Sync(password, "salt", 10000, 16, "sha256");
}

function hashData(data: string): string {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
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
  static async addVoterBulk(request: MulterRequest): Promise<any> {
    const file = request.file as File;
    if (!file) {
      throw new BadRequestError("No File Uploaded");
    }
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: {
      nfcSerialNumber: string;
      NIK: string;
      name: string;
    }[] = xlsx.utils.sheet_to_json(worksheet);
    const formattedData = data.map((row) => ({
      ...row,
      NIK: row.NIK.toString(),
    }));
    let transactionData: any[] = [];
    const transaction = await prismaClient.$transaction(
      async (prismaClient) => {
        for (const val of formattedData) {
          const hashedNIK = hashData(val.NIK);
          await votingContract.methods
            .checkIfNIKNotRegistered(hashedNIK)
            .call();
          const voter = await prismaClient.voter.create({
            data: val,
          });
          const data = await votingContract.methods
            .addNIK(hashedNIK)
            .encodeABI();

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
          transactionData.push(val);
        }
      }
    );

    return transaction;
  }
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
    const hashedNIK = hashData(nik);
    await votingContract.methods.checkIfNIKNotRegistered(hashedNIK).call();

    const transaction = await prismaClient.$transaction(async (prisma) => {
      const voter = await prisma.voter.create({
        data: {
          name: name,
          nfcSerialNumber: nfcSN,
          NIK: nik,
        },
      });
      const data = await votingContract.methods.addNIK(hashedNIK).encodeABI();

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
    const voters = await prismaClient.voter.findMany({
      select: {
        id: true,
        name: true,
        NIK: true,
        nfcSerialNumber: true,
      },
    });
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
    console.log(request.body);
    const voterVoteRequest: VoterVoteRequest = request.body as VoterVoteRequest;

    const voter = await prismaClient.voter.findUnique({
      where: {
        NIK: "350204087862273",
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

    const candidate = await prismaClient.candidate.findUnique({
      where: {
        id: parseInt(voterVoteRequest.candidateId.toString()),
      },
      select: {
        name: true,
        noUrut: true,
      },
    });
    const hashedNIK = hashData(voter.NIK);
    console.log(hashedNIK);
    await votingContract.methods.checkIfNIKRegistered(hashedNIK).call();
    await votingContract.methods
      .checkIfCandidateValid(candidate?.noUrut)
      .call();

    const newAccount = web3.eth.accounts.create();
    const account = web3.eth.accounts.privateKeyToAccount(
      newAccount.privateKey
    );
    const data = votingContract.methods
      .vote(candidate?.noUrut, hashedNIK)
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
    console.log(account.address);

    const voteData: {
      "0": string;
      "1": string;
      "2": string;
    } = await votingContract.methods.getVoter().call({ from: account.address });

    const hasVoted = voteData["0"];
    const candidateId = voteData["1"].toString();
    const NIK = voteData["2"].toString();

    const candidate = await prismaClient.candidate.findUnique({
      where: { id: parseInt(candidateId) },
      select: {
        id: true,
        name: true,
        noUrut: true,
      },
    });

    const formattedData = {
      hasVoted: hasVoted,
      votedCandidate: candidate?.noUrut,
      votedCandidateName: candidate?.name,
      NIK: NIK,
    };

    return formattedData;
  }

  static async hasVoterVote(request: FastifyRequest): Promise<any> {
    if (!request.body) {
      throw new BadRequestError("request body is needed");
    }
    const { nfcSerialNumber } = request.body as { nfcSerialNumber: string };
    if (!nfcSerialNumber) {
      throw new BadRequestError("'nfcSerialNumber' is required");
    }
    const voter = await prismaClient.voter.findUnique({
      where: {
        nfcSerialNumber: nfcSerialNumber,
      },
      select: {
        id: true,
        nfcSerialNumber: true,
        NIK: true,
      },
    });

    if (!voter) {
      throw new NotFoundError("Tidak Terdaftar");
    }

    const hashedNIK = hashData(voter.NIK);
    try {
      await votingContract.methods.checkIfNIKHasUsed(hashedNIK).call();
    } catch (error) {
      return true;
    }
    return {
      id: voter.id,
      nfcSerialNumber: voter.nfcSerialNumber,
    };
  }
}

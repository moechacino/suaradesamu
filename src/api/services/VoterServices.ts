import crypto, { createHash } from "crypto";
import { FastifyRequest } from "fastify";
import {
  VoterGetVoteRequest,
  VoterRegisterRequest,
  VoterVoteRequest,
  toVoterResponse,
} from "../models/VoterModel";
import { prismaClient } from "../../config/database";
import { ForbiddenError } from "../errors/ForbiddenError";
import {
  contractABI,
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
import { findAbiFunctionBySignature } from "./TransactionService";
import { AbiInput } from "web3";
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
    const voterVoteRequest: VoterVoteRequest = request.body as VoterVoteRequest;

    const voter = await prismaClient.voter.findUnique({
      where: {
        nfcSerialNumber: voterVoteRequest.nfcSerialNumber,
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
    const { nfcSerialNumber, transactionAddress } =
      request.body as VoterGetVoteRequest;
    const voter = await prismaClient.voter.findUnique({
      where: { nfcSerialNumber: nfcSerialNumber },
    });

    const hashedNIK = hashData(voter?.NIK || "fake");
    const tx = await web3.eth.getTransaction(transactionAddress);

    let decodedInputs: any = null;
    if (tx.input) {
      const functionSignature = tx.input.slice(0, 10);
      const abiFunction = findAbiFunctionBySignature(
        contractABI,
        functionSignature
      );

      if (abiFunction) {
        if (abiFunction.inputs) {
          const mutableInputs: AbiInput[] = abiFunction.inputs.map((param) => ({
            ...param,
          }));

          decodedInputs = web3.eth.abi.decodeParameters(
            mutableInputs,
            tx.input.slice(10)
          );
        }
        for (const key in decodedInputs) {
          if (typeof decodedInputs[key] === "bigint") {
            decodedInputs[key] = decodedInputs[key].toString();
          }
        }
      }
    }
    const block = await web3.eth.getBlock(tx.blockNumber);
    const timestamp = block.timestamp;
    const nowDate = new Date(Number(timestamp) * 1000);
    const wibOffset = 7 * 60; // WIB is UTC+7
    // const dateTransactionWIB = new Date(
    //   nowDate.getTime() + wibOffset * 60 * 1000
    // );
    const dateTransactionWIB = nowDate;
    const year = dateTransactionWIB.getFullYear();
    const month = dateTransactionWIB.getFullYear();
    const day = dateTransactionWIB.getDay();
    const hours = dateTransactionWIB.getHours();
    const minutes = dateTransactionWIB.getMinutes();
    let data: object;
    if (!decodedInputs._NIK || !decodedInputs._candidateId) {
      data = {
        fulldate: dateTransactionWIB,
        date: `${year}-${month}-${day}`,
        time: `${hours}.${minutes}`,
        candidateNumber: null,
        candidateName: null,
        candidatePhoto: null,
        transactionAddress: transactionAddress,
      };
    } else {
      if (hashedNIK === decodedInputs._NIK) {
        const candidate = await prismaClient.candidate.findUnique({
          where: {
            noUrut: 1,
          },
          select: {
            name: true,
            photoProfileUrl: true,
          },
        });
        data = {
          fulldate: dateTransactionWIB,
          date: `${year}-${month}-${day}`,
          time: `${hours}.${minutes}`,
          candidateNumber: decodedInputs._candidateId,
          candidateName: candidate?.name,
          candidatePhoto: candidate?.photoProfileUrl,
          transactionAddress: transactionAddress,
        };
      } else {
        throw new ForbiddenError("KTP dan Alamat Transaksi Tidak Sesuai");
      }
    }

    return data;
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

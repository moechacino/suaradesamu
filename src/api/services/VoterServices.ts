import crypto from "crypto";
import { FastifyRequest } from "fastify";
import { VoterRegisterRequest, VoterVoteRequest } from "../models/VoterModel";
import { prismaClient } from "../../config/database";
import { ForbiddenError } from "../errors/ForbiddenError";
import {
  contractAddress,
  contractOwner,
  votingContract,
  web3,
} from "../../config/web3";
import { BadRequestError } from "../errors/BadRequestError";
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
  static async register(request: FastifyRequest): Promise<any> {
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
      throw new BadRequestError("Address Tidak Sesuai");
    }

    const newAccount = web3.eth.accounts.create();
    const account = web3.eth.accounts.privateKeyToAccount(
      newAccount.privateKey
    );
    const data = votingContract.methods
      .vote(voterVoteRequest.candidateId, voter.NIK)
      .encodeABI();

    //   send balance to new account
    await web3.eth.sendTransaction({
      from: contractOwner,
      to: account.address,
      value: web3.utils.toWei("1", "ether"),
      gasPrice: web3.utils.toWei("10", "gwei"),
    });
    //
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
    const { address, nfcSN } = request.body as {
      address: string;
      nfcSN: string;
    };
    const account = await prismaClient.account.findFirst({
      where: {
        address: address,
      },
      include: {
        voter: {
          select: {
            NIK: true,
          },
        },
      },
    });

    const voter = await prismaClient.voter.findUnique({
      where: {
        nfcSerialNumber: nfcSN,
      },
      select: {
        NIK: true,
      },
    });

    if (!account || voter?.NIK !== account.voter.NIK) {
      throw new ForbiddenError("address dan nik tidak sesuai");
    }
    const voteData: [] = await votingContract.methods.getVoter(address).call();

    const formattedData = voteData.map((val: any) => ({
      id: val.id.toString(),
      name: val.name,
      voteCount: val.voteCount.toString(),
    }));

    return formattedData;
  }
}

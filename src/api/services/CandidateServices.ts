import { prismaClient } from "../../config/database";
import {
  web3,
  votingContract,
  contractOwner,
  contractAddress,
  contractOwnerPkey,
} from "../../config/web3";
import { CustomAPIError } from "../errors/CustomAPIError";
import { NotFoundError } from "../errors/NotFoundError";
import { CandidateResponse } from "../models/CandidateModel";
export class CandidateService {
  // static async create(request: FastifyRequest): Promise<CandidateResponse> {

  // }

  static async testCreateAccount(id: number): Promise<any> {
    const candidate = await prismaClient.candidate.findUnique({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      throw new NotFoundError("candidate not found");
    }
    const data = votingContract.methods
      .addCandidate(candidate.name, candidate.id)
      .encodeABI();

    const tx = {
      from: contractOwner,
      to: contractAddress,
      gasPrice: web3.utils.toWei("10", "gwei"),

      data: data,
    };
    if (contractOwnerPkey) {
      const signedTx = await web3.eth.accounts.signTransaction(
        tx,
        contractOwnerPkey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return receipt.transactionHash;
    } else {
      return false;
    }
  }

  static async getAll(): Promise<any> {
    const candidates: [] = await votingContract.methods
      .getAllCandidates()
      .call();

    const formattedCandidates = candidates.map((candidate: any) => ({
      id: candidate.id.toString(),
      name: candidate.name,
      voteCount: candidate.voteCount.toString(),
    }));

    return formattedCandidates;
  }
}

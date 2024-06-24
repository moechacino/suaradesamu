import { FastifyRequest } from "fastify";
import {
  contractAddress,
  contractOwner,
  contractOwnerPkey,
  votingContract,
  web3,
} from "../../config/web3";
import { BadRequestError } from "../errors/BadRequestError";

export class VotingService {
  static async startVoting(request: FastifyRequest) {
    const { durationInMiliseconds } = request.body as {
      durationInMiliseconds: string;
    };
    if (isNaN(Number(durationInMiliseconds))) {
      throw new BadRequestError("id must be number");
    }
    await votingContract.methods.checkIsVotingEnd().send({
      from: contractOwner,
      gasPrice: web3.utils.toWei("10", "gwei"),
    });
    const data = await votingContract.methods
      .startVoting(parseInt(durationInMiliseconds))
      .encodeABI();
    const tx = {
      from: contractOwner,
      to: contractAddress,
      gasPrice: web3.utils.toWei("10", "gwei"),
      data: data,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      contractOwnerPkey || "FAKE PKEY"
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    const votingStatus: {
      "0": any;
      "1": any;
      "2": any;
    } = await votingContract.methods.getVotingStatus().call();

    const doesVotingRun = votingStatus["0"];
    const start = new Date(Number(BigInt(votingStatus["1"])) * 1000);
    const end = new Date(Number(BigInt(votingStatus["2"])) * 1000);
    const formattedVotingStatus = {
      votingStatus: doesVotingRun,
      start: start,
      end: end,
    };
    return formattedVotingStatus;
  }

  static async endVoting(): Promise<object> {
    await votingContract.methods.checkIsVotingEnd().send({
      from: contractOwner,
      gasPrice: web3.utils.toWei("10", "gwei"),
    });

    const data = await votingContract.methods.endVoting().encodeABI();
    const tx = {
      from: contractOwner,
      to: contractAddress,
      gasPrice: web3.utils.toWei("10", "gwei"),
      data: data,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      contractOwnerPkey || "FAKE PKEY"
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    const votingStatus: {
      "0": any;
      "1": any;
      "2": any;
    } = await votingContract.methods.getVotingStatus().call();

    const doesVotingRun = votingStatus["0"];
    const start = new Date(Number(BigInt(votingStatus["1"])) * 1000);
    const end = new Date(Number(BigInt(votingStatus["2"])) * 1000);
    const formattedVotingStatus = {
      votingStatus: doesVotingRun,
      start: start,
      end: end,
    };
    return formattedVotingStatus;
  }
  static async getVotingStatus() {
    await votingContract.methods.checkIsVotingEnd().send({
      from: contractOwner,
      gasPrice: web3.utils.toWei("10", "gwei"),
    });
    const votingStatus: {
      "0": any;
      "1": any;
      "2": any;
    } = await votingContract.methods.getVotingStatus().call();

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
  }
}

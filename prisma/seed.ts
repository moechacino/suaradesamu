import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
import { dumpVoter } from "./dump/voter";
import { candidateData } from "./dump/candidate";
import {
  contractAddress,
  contractOwner,
  contractOwnerPkey,
  votingContract,
  web3,
} from "../src/config/web3";
import crypto, { createHash } from "crypto";
function hashData(data: string): string {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

const addAdmin = async () => {
  const isExist = await prismaClient.admin.findUnique({
    where: {
      username: "admin1",
    },
  });
  if (!isExist) {
    const username = "admin";
    const password = await bcrypt.hash("suaradesamu", 10);
    await prismaClient.admin.create({
      data: {
        username: username,
        password: password,
      },
    });
  }
};

const addVoterAndPin = async () => {
  for (const val of dumpVoter) {
    const createdVoter = await prismaClient.voter.create({
      data: {
        nfcSerialNumber: val.nfsSerialNumber,
        name: val.name,
        NIK: val.NIK,
      },
    });
    const hashedNIK = hashData(createdVoter.NIK);
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
    await prismaClient.pin.create({
      data: {
        pinCode: val.PIN,
        voterId: createdVoter.id,
      },
    });
  }
};

const addCandidate = async () => {
  for (const val of candidateData) {
    const candidate = await prismaClient.candidate.create({
      data: {
        name: val.name,
        age: val.age,
        noUrut: val.noUrut,
        photoProfileAlt: val.photoProfileAlt,
        photoProfileUrl: val.photoProfileUrl,
      },
    });

    const data = await votingContract.methods
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
    }
  }
};

(async () => {
  try {
    await addAdmin();
    await addVoterAndPin();
    await addCandidate();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect;
  }
})();

import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
import { dumpVoter } from "./dump/voter";
import { candidateData } from "./dump/candidate";
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
    await prismaClient.candidate.create({
      data: {
        name: val.name,
        age: val.age,
        photoProfileAlt: val.photoProfileAlt,
        photoProfileUrl: val.photoProfileUrl,
      },
    });
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

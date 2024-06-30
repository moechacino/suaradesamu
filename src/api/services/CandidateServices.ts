import { Transaction } from "web3";
import { prismaClient } from "../../config/database";
import {
  web3,
  votingContract,
  contractOwner,
  contractAddress,
  contractOwnerPkey,
} from "../../config/web3";
import { NotFoundError } from "../errors/NotFoundError";
import {
  CandidateCreateRequest,
  CandidateResponse,
  EducationCreateRequest,
  OrganizationCreateRequest,
  WorkExperienceCreateRequest,
  WorkPlanCreateRequest,
  toCandidateResponse,
} from "../models/CandidateModel";
import { File } from "fastify-multer/lib/interfaces";
import { MulterRequest } from "../../types/multerType";
import { FastifyRequest } from "fastify";
import { BadRequestError } from "../errors/BadRequestError";
export class CandidateService {
  static async create(request: MulterRequest): Promise<CandidateResponse> {
    const createRequest: CandidateCreateRequest =
      request.body as CandidateCreateRequest;

    const file = request.file as File;

    const transaction = await prismaClient.$transaction(
      async (prismaClient) => {
        const candidate = await prismaClient.candidate.create({
          data: {
            name: createRequest.name,
            age: parseInt(createRequest.age.toString()),
            noUrut: parseInt(createRequest.noUrut.toString()),
            visi: createRequest.visi,
            photoProfileAlt: file.filename!,
            photoProfileUrl: `https://dory-liberal-uniformly.ngrok-free.app/profile/${file.filename}`,
          },
        });

        if (candidate) {
          const data = await votingContract.methods
            .addCandidate(candidate.name, candidate.noUrut)
            .encodeABI();

          const tx: Transaction = {
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
        }
        return { candidate };
      }
    );

    return toCandidateResponse(transaction["candidate"]);
  }

  static async addOrganization(request: FastifyRequest): Promise<object> {
    const { id } = request.params as { id: string };
    if (isNaN(Number(id))) {
      throw new BadRequestError("id must be number");
    }
    const organizationRequest: OrganizationCreateRequest =
      request.body as OrganizationCreateRequest;
    const organization = await prismaClient.organizationExperience.create({
      data: {
        candidate: { connect: { id: parseInt(id) } },
        title: organizationRequest.title,
        periodStart: new Date(organizationRequest.periodStart),
        periodEnd: organizationRequest.periodEnd
          ? new Date(organizationRequest.periodEnd)
          : null,
      },
    });
    return organization;
  }

  static async addWorkExperience(request: FastifyRequest): Promise<object> {
    const { id } = request.params as { id: string };
    if (isNaN(Number(id))) {
      throw new BadRequestError("id must be number");
    }
    const workExperienceRequest: WorkExperienceCreateRequest =
      request.body as WorkExperienceCreateRequest;

    const workExperience = await prismaClient.workExperience.create({
      data: {
        candidate: { connect: { id: parseInt(id) } },
        title: workExperienceRequest.title,
        periodStart: new Date(workExperienceRequest.periodStart),
        periodEnd: workExperienceRequest.periodEnd
          ? new Date(workExperienceRequest.periodEnd)
          : null,
      },
    });
    return workExperience;
  }

  static async addEducation(request: FastifyRequest): Promise<object> {
    const { id } = request.params as { id: string };
    if (isNaN(Number(id))) {
      throw new BadRequestError("id must be number");
    }
    const educationRequest: EducationCreateRequest =
      request.body as EducationCreateRequest;
    const education = await prismaClient.education.create({
      data: {
        candidate: { connect: { id: parseInt(id) } },
        degree: educationRequest.degree,
        institution: educationRequest.institution,
        periodStart: new Date(educationRequest.periodStart),
        periodEnd: educationRequest.periodEnd
          ? new Date(educationRequest.periodEnd)
          : null,
      },
    });
    return education;
  }

  static async addWorkPlan(request: FastifyRequest): Promise<object> {
    const { id } = request.params as { id: string };
    if (isNaN(Number(id))) {
      throw new BadRequestError("id must be number");
    }
    const workPlanRequest: WorkPlanCreateRequest =
      request.body as WorkPlanCreateRequest;
    const workPlan = await prismaClient.workPlan.create({
      data: {
        candidate: { connect: { id: parseInt(id) } },
        title: workPlanRequest.title,
        detail: workPlanRequest.detail,
      },
    });
    return workPlan;
  }

  static async getOne(id: number): Promise<any> {
    const candidate = await prismaClient.candidate.findUnique({
      where: {
        id: id,
      },
      include: {
        organization: {
          select: {
            id: true,
            title: true,
            periodStart: true,
            periodEnd: true,
          },
        },
        workExperience: {
          select: {
            id: true,
            title: true,
            periodStart: true,
            periodEnd: true,
          },
        },
        workPlan: {
          select: {
            id: true,
            title: true,
            detail: true,
          },
        },
        education: {
          select: {
            id: true,
            degree: true,
            institution: true,
            periodStart: true,
            periodEnd: true,
          },
        },
      },
    });

    if (!candidate) {
      return null;
    }

    const formatDate = (date: Date | null): string | null => {
      if (!date) return " sekarang";
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("id-ID", options).format(date);
    };
    const formattedCandidate = {
      ...candidate,
      organization: candidate.organization.map((org) => ({
        ...org,
        periodStart: formatDate(org.periodStart),
        periodEnd: formatDate(org.periodEnd),
      })),
      workExperience: candidate.workExperience.map((exp) => ({
        ...exp,
        periodStart: formatDate(exp.periodStart),
        periodEnd: formatDate(exp.periodEnd),
      })),
      education: candidate.education.map((edu) => ({
        ...edu,
        periodStart: formatDate(edu.periodStart),
        periodEnd: formatDate(edu.periodEnd),
      })),
    };

    return formattedCandidate;
  }

  static async getAll(): Promise<any> {
    const candidates = await prismaClient.candidate.findMany({
      orderBy: {
        noUrut: "asc",
      },
      include: {
        organization: {
          select: {
            id: true,
            title: true,
            periodStart: true,
            periodEnd: true,
          },
        },
        workExperience: {
          select: {
            id: true,
            title: true,
            periodStart: true,
            periodEnd: true,
          },
        },
        workPlan: {
          select: {
            id: true,
            title: true,
            detail: true,
          },
        },
        education: {
          select: {
            id: true,
            degree: true,
            institution: true,
            periodStart: true,
            periodEnd: true,
          },
        },
      },
    });

    const formatDate = (date: Date | null): string | null => {
      if (!date) return " sekarang";
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("id-ID", options).format(date);
    };
    const formattedCandidates = candidates.map((candidate) => ({
      ...candidate,
      organization: candidate.organization.map((org) => ({
        ...org,
        periodStart: formatDate(org.periodStart),
        periodEnd: formatDate(org.periodEnd),
      })),
      workExperience: candidate.workExperience.map((exp) => ({
        ...exp,
        periodStart: formatDate(exp.periodStart),
        periodEnd: formatDate(exp.periodEnd),
      })),
      education: candidate.education.map((edu) => ({
        ...edu,
        periodStart: formatDate(edu.periodStart),
        periodEnd: formatDate(edu.periodEnd),
      })),
    }));

    return formattedCandidates;
  }

  static async testCreateAccount(id: number): Promise<any> {
    const candidate = await prismaClient.candidate.findUnique({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      throw new NotFoundError("candidate not found");
    }
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
      return receipt.transactionHash;
    } else {
      return false;
    }
  }
}

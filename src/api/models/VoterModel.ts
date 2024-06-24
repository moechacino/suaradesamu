import { Voter } from "@prisma/client";

export type VoterRegisterRequest = {
  nfcSN: string;
  pin: string;
};

export type VoterVoteRequest = {
  nik: string;
  phone?: string | null;
  candidateId: number;
};
export type VoterResponse = {
  id: number;
  nik: string;
};

export function toVoterResponse(voter: Voter): VoterResponse {
  return {
    id: voter.id,
    nik: voter.NIK,
  };
}

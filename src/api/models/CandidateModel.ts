import { Candidate } from "@prisma/client";

export type CandidateCreateRequest = {
  name: string;
  age: number;
};

export type CandidateResponse = {
  id: number;
  name: string;
  age: number;
  photoProfileUrl: string;
  photoProfileAlt: string;
  workPlan?: object[] | null;
  education?: object[] | null;
  workExperience?: object[] | null;
  organization?: object[] | null;
};

export function toCandidateResponse(candidate: Candidate): CandidateResponse {
  return {
    id: candidate.id,
    name: candidate.name,
    age: candidate.age,
    photoProfileUrl: candidate.photoProfileUrl,
    photoProfileAlt: candidate.photoProfileAlt,
  };
}

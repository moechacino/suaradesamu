import { Candidate } from "@prisma/client";
export type CandidateCreateRequest = {
    name: string;
    age: number;
    noUrut: number;
};
export type OrganizationCreateRequest = {
    title: string;
    periodStart: Date;
    periodEnd: Date;
};
export type WorkExperienceCreateRequest = {
    title: string;
    periodStart: Date;
    periodEnd: Date;
};
export type EducationCreateRequest = {
    degree: string;
    institution: string;
    periodStart: Date;
    periodEnd: Date;
};
export type WorkPlanCreateRequest = {
    title: string;
    detail: string;
};
export type CandidateResponse = {
    id: number;
    name: string;
    age: number;
    noUrut: number;
    photoProfileUrl: string;
    photoProfileAlt: string;
    workPlan?: object[] | null;
    education?: object[] | null;
    workExperience?: object[] | null;
    organization?: object[] | null;
};
export declare function toCandidateResponse(candidate: Candidate): CandidateResponse;

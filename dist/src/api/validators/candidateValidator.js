"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidator = void 0;
class CandidateValidator {
    static createOrganization() {
        const schema = {
            body: {
                type: "object",
                required: ["title", "periodStart"],
                properties: {
                    title: { type: "string" },
                    periodStart: { type: "string", format: "date" },
                    periodEnd: { type: "string" },
                },
            },
        };
        return schema;
    }
    static createWorkExperience() {
        const schema = {
            body: {
                type: "object",
                required: ["title", "periodStart"],
                properties: {
                    title: { type: "string" },
                    periodStart: { type: "string", format: "date" },
                    periodEnd: { type: "string" },
                },
            },
        };
        return schema;
    }
    static createEducation() {
        const schema = {
            body: {
                type: "object",
                required: ["degree", "institution", "periodStart"],
                properties: {
                    title: { type: "string" },
                    institution: { type: "string" },
                    periodStart: { type: "string", format: "date" },
                    periodEnd: { type: "string" },
                },
            },
        };
        return schema;
    }
    static createWorkPlan() {
        const schema = {
            body: {
                type: "object",
                required: ["title", "detail"],
                properties: {
                    title: { type: "string" },
                    detail: { type: "string" },
                },
            },
        };
        return schema;
    }
}
exports.CandidateValidator = CandidateValidator;

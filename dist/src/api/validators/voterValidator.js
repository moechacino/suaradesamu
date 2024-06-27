"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoterValidator = void 0;
class VoterValidator {
    static addVoter() {
        const schema = {
            body: {
                type: "object",
                required: ["nik", "nfcSN", "name"],
                properties: {
                    nik: { type: "string" },
                    nfcSN: { type: "string" },
                    name: { type: "string" },
                },
            },
        };
        return schema;
    }
    static register() {
        const schema = {
            body: {
                type: "object",
                required: ["nfcSN", "pin"],
                properties: {
                    nfcSN: { type: "string" },
                    pin: { type: "string" },
                },
            },
        };
        return schema;
    }
    static vote() {
        const schema = {
            body: {
                type: "object",
                required: ["nik", "candidateId"],
                properties: {
                    nik: { type: "string" },
                    phone: { type: "string" },
                    candidateId: { type: "integer" },
                },
            },
        };
        return schema;
    }
    static getVote() {
        const schema = {
            body: {
                type: "object",
                required: ["privateKey"],
                properties: {
                    privateKey: { type: "string" },
                },
            },
        };
        return schema;
    }
}
exports.VoterValidator = VoterValidator;

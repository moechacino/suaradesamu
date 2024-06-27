"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotingValidator = void 0;
class VotingValidator {
    static startVoting() {
        const schema = {
            body: {
                type: "object",
                required: ["durationInMiliseconds"],
                properties: {
                    durationInMiliseconds: { type: "string" },
                },
            },
        };
        return schema;
    }
}
exports.VotingValidator = VotingValidator;

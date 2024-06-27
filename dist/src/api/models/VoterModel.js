"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toVoterResponse = void 0;
function toVoterResponse(voter) {
    return {
        id: voter.id,
        nik: voter.NIK,
    };
}
exports.toVoterResponse = toVoterResponse;

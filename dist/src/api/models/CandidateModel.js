"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCandidateResponse = void 0;
function toCandidateResponse(candidate) {
    return {
        id: candidate.id,
        name: candidate.name,
        age: candidate.age,
        noUrut: candidate.noUrut,
        photoProfileUrl: candidate.photoProfileUrl,
        photoProfileAlt: candidate.photoProfileAlt,
    };
}
exports.toCandidateResponse = toCandidateResponse;

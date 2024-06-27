"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAdminResponse = void 0;
function toAdminResponse(admin) {
    return {
        id: admin.id,
        username: admin.username,
        token: admin.token,
    };
}
exports.toAdminResponse = toAdminResponse;

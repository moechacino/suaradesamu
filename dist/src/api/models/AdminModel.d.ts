import { Admin } from "@prisma/client";
export type LoginAdminRequest = {
    username: string;
    password: string;
};
export type AdminResponse = {
    id: number;
    username: string;
    token?: string | null;
};
export declare function toAdminResponse(admin: Admin): AdminResponse;

/// <reference types="node" />
import "fastify";
import { File } from "fastify-multer/lib/interfaces";
import { FastifyRequest } from "fastify";
declare module "fastify" {
    interface FastifyRequest {
        file: File;
        files: File[];
    }
}
declare const multerOption: {
    storage: {
        getFilename: import("fastify-multer/lib/interfaces").GetFileName;
        getDestination: import("fastify-multer/lib/interfaces").GetDestination;
        _handleFile(req: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>, file: File, cb: (error: Error | null, info?: Partial<File> | undefined) => void): void;
        _removeFile(_req: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>, file: File, cb: (error?: Error | null | undefined) => void): void;
    };
    fileFilter(req: FastifyRequest, file: File, callback: Function): void;
    limits: {
        fileSize: number;
    };
};
export default multerOption;

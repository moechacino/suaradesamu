"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const BadRequestError_1 = require("../errors/BadRequestError");
require("fastify");
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const storage = fastify_multer_1.default.diskStorage({
    destination(req, file, callback) {
        const dest = "uploads/candidate/profile";
        if (!fs_1.default.existsSync(dest)) {
            fs_1.default.mkdirSync(dest, { recursive: true });
        }
        callback(null, dest);
    },
    filename(req, file, callback) {
        let replacedName;
        const { name } = req.body;
        if (!name) {
            callback(new BadRequestError_1.BadRequestError("filed 'name' required. Input Candidate Name First! Place Input Name Above Photo Profile File "), "");
        }
        else {
            replacedName = name.replace(/\s+/g, "-");
            callback(null, "PP_" + replacedName + file.mimetype.replace("image/", "."));
        }
    },
});
const multerOption = {
    storage: storage,
    fileFilter(req, file, callback) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true);
        }
        else {
            callback(new BadRequestError_1.BadRequestError("Only JPEG and PNG images are allowed"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
exports.default = multerOption;

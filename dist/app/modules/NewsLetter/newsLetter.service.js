"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const getNewsLetter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.newsLetter.findFirst({
        where: {
            email,
            isDeleted: false,
        },
    });
    return result;
});
const createNewsLetter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is email exists
    const isNewsLetterExists = yield prisma_1.default.newsLetter.findFirst({
        where: {
            email,
            isDeleted: false,
        },
    });
    if (isNewsLetterExists) {
        throw new ApiError_1.default(400, "News letter alreday exists!");
    }
    const result = yield prisma_1.default.newsLetter.create({
        data: { email },
    });
    return result;
});
exports.NewsLetterService = {
    createNewsLetter,
    getNewsLetter,
};

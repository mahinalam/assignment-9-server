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
exports.NewsLetterController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const newsLetter_service_1 = require("./newsLetter.service");
const getNewsLetter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield newsLetter_service_1.NewsLetterService.getNewsLetter(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "News letter retrieved  successfuly!",
        data: result,
    });
}));
const createNewsLetter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield newsLetter_service_1.NewsLetterService.createNewsLetter(req.body.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "News letter created successfuly!",
        data: result,
    });
}));
exports.NewsLetterController = {
    createNewsLetter,
    getNewsLetter,
};

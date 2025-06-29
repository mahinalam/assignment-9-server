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
exports.BrandService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createBrandIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is brand exists
    const isBrandExists = yield prisma_1.default.brand.findFirst({
        where: { name: payload.name },
    });
    if (isBrandExists) {
        throw new ApiError_1.default(400, "Brand already exists!");
    }
    // is brand deleted
    if (isBrandExists === null || isBrandExists === void 0 ? void 0 : isBrandExists.isDeleted) {
        throw new ApiError_1.default(400, "Brand already deleted!");
    }
    const result = yield prisma_1.default.brand.create({
        data: payload,
    });
    return result;
});
const getAllBrandFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.brand.findMany();
    return result;
});
exports.BrandService = {
    createBrandIntoDB,
    getAllBrandFromDB,
    //   createCustomer,
};

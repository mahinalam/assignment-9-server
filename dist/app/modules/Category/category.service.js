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
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createCategoryIntoDB = (payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    // check is category exists
    const isCategoryExists = yield prisma_1.default.category.findFirst({
        where: { name: payload.name, isDeleted: false },
    });
    if (isCategoryExists) {
        throw new ApiError_1.default(400, "Category already exists!");
    }
    // is category deleted
    if (isCategoryExists === null || isCategoryExists === void 0 ? void 0 : isCategoryExists.isDeleted) {
        throw new ApiError_1.default(400, "Category already deleted!");
    }
    if (image) {
        payload.imageUrl = image.path;
    }
    const result = yield prisma_1.default.category.create({
        data: payload,
    });
    return result;
});
const getAllCategoriesFromDB = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.category.findMany({
        where: { isDeleted: false },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.category.count({
        where: {
            isDeleted: false,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUniqueOrThrow({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    return result;
});
// delete category
const deleteCategoryFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.update({
        where: {
            id: categoryId,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategory,
    deleteCategoryFromDB,
};

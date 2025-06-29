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
exports.WishListService = exports.createWishlistIntoDB = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createWishlistIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = payload;
    // check products
    yield prisma_1.default.product.findFirstOrThrow({
        where: {
            isDeleted: false,
            id: productId,
        },
    });
    // Check if the wishlist already exists for the customer
    const wishlist = yield prisma_1.default.wishlist.findFirst({
        where: { userId, productId, isDeleted: false },
    });
    if (wishlist) {
        throw new ApiError_1.default(400, "Product already added to wishlist.");
    }
    const result = yield prisma_1.default.wishlist.create({
        data: {
            userId,
            productId,
        },
    });
    return result;
});
exports.createWishlistIntoDB = createWishlistIntoDB;
const getUsersWishlistsFromDB = (paginationOption, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.wishlist.findMany({
        where: {
            userId,
            isDeleted: false,
        },
        select: {
            product: {
                select: {
                    id: true,
                    name: true,
                    images: true,
                    price: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.wishlist.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const removeFromWishlistFromDB = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // check is wishlist exists
    const isWishlistExists = yield prisma_1.default.wishlist.findFirst({
        where: {
            userId,
            productId,
            isDeleted: false,
        },
    });
    if (!isWishlistExists) {
        throw new ApiError_1.default(404, "Wislist isn't exists.");
    }
    const result = yield prisma_1.default.wishlist.delete({
        where: {
            userId_productId: {
                userId,
                productId,
            },
            isDeleted: false,
        },
    });
    return result;
});
exports.WishListService = {
    createWishlistIntoDB: exports.createWishlistIntoDB,
    getUsersWishlistsFromDB,
    removeFromWishlistFromDB,
};

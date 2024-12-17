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
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
// get all product specific reviews from db
const getProductSpecificReviews = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.review.findMany({
        where: {
            productId,
            isDeleted: false,
        },
        // include: {
        //   user: true,
        // },
    });
    return result;
});
const getAllVendorProductsReviews = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    // await prisma.product.findUniqueOrThrow({
    //   where: {
    //     id: vendorId,
    //     isDeleted: false,
    //   },
    // });
    // const result = await prisma.review.findMany({
    //   where: {
    //     productId,
    //     isDeleted: false,
    //   },
    // });
    // return result;
    const vendorProducts = yield prisma_1.default.shop.findUnique({
        where: {
            ownerId, // Match the Vendor's `ownerId`
        },
        include: {
            products: {
                include: {
                    review: {
                        select: {
                            rating: true,
                            comment: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    return vendorProducts;
});
const createReviewIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    if (images && images.reviewImages.length > 0) {
        payload.images = images.reviewImages.map((image) => image.path);
    }
    else {
        payload.images = [];
    }
    const result = yield prisma_1.default.review.create({
        data: payload,
    });
    return result;
});
exports.ReviewService = {
    getAllVendorProductsReviews,
    createReviewIntoDB,
    getProductSpecificReviews,
    //   createCustomer,
};
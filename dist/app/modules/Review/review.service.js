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
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// get all reviews
const getAllReviewsFromDB = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.review.findMany({
        where: {
            isDeleted: false,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
        select: {
            rating: true,
            id: true,
            customer: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
            product: {
                select: {
                    name: true,
                    images: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.review.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get  product specific reviews
const getProductSpecificReviews = (fieldParams, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const { productId, rating } = fieldParams;
    const andCondition = [];
    // Filter by specific fields
    if (productId) {
        andCondition.push({
            productId,
        });
    }
    if (rating) {
        andCondition.push({ rating: Number(rating) });
    }
    // Combine all conditions
    const whereCondition = {
        AND: andCondition,
    };
    // Query database
    const result = yield prisma_1.default.review.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: {
            customer: {
                select: {
                    email: true,
                    name: true,
                    profilePhoto: true,
                    id: true,
                },
            },
        },
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.review.count({
        where: whereCondition,
    });
    const aggregateRating = yield prisma_1.default.review.aggregate({
        where: {
            productId: productId,
            isDeleted: false,
        },
        _avg: {
            rating: true,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: { result, aggregateRating },
    };
});
const getAllVendorProductsReviews = (paginationOption, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // check is vendor exits
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const isVendorExists = yield prisma_1.default.vendor.findUnique({
        where: {
            email,
            isDeleted: false,
        },
        select: {
            shop: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!isVendorExists) {
        throw new ApiError_1.default(404, "Vendor not found");
    }
    const vendorProducts = yield prisma_1.default.review.findMany({
        where: {
            shopId: (_a = isVendorExists === null || isVendorExists === void 0 ? void 0 : isVendorExists.shop) === null || _a === void 0 ? void 0 : _a.id,
            isDeleted: false, // Match the Vendor's `ownerId`
        },
        include: {
            product: {
                omit: {
                    isDeleted: true,
                    isFeatured: true,
                    isFlashed: true,
                    createdAt: true,
                    updatedAt: true,
                    shopId: true,
                    categoryId: true,
                },
            },
            customer: {
                select: {
                    email: true,
                },
            },
        },
        omit: {
            customerId: true,
            productId: true,
            shopId: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.review.count({
        where: {
            shopId: (_b = isVendorExists === null || isVendorExists === void 0 ? void 0 : isVendorExists.shop) === null || _b === void 0 ? void 0 : _b.id,
            isDeleted: false, // Match the Vendor's `ownerId`
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: vendorProducts,
    };
});
// const getUserProductReview = async (
//   customerId: string,
//   paginationOption: any
// ) => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const userReviews = await prisma.review.findMany({
//     where: {
//       customerId,
//       isDeleted: false, // Match the Vendor's `ownerId`
//     },
//     select: {
//       id: true,
//       images: true,
//       createdAt: true,
//       rating: true,
//       product: {
//         select: {
//           id: true,
//           images: true,
//           name: true,
//           category: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       },
//       customer: {
//         select: {
//           name: true,
//           id: true,
//           profilePhoto: true,
//         },
//       },
//     },
//     skip: skip,
//     take: limit,
//     orderBy: {
//       [sortBy || "createdAt"]: sortOrder || "desc",
//     },
//   });
//   const total = await prisma.review.count({
//     where: {
//       customerId,
//       isDeleted: false, // Match the Vendor's `ownerId`
//     },
//   });
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: userReviews,
//   };
// };
const getUserProductReview = (userId, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const userReviews = yield prisma_1.default.review.findMany({
        where: {
            customer: {
                userId,
            },
            isDeleted: false,
        },
        select: {
            id: true,
            images: true,
            createdAt: true,
            rating: true,
            comment: true,
            product: {
                select: {
                    id: true,
                    images: true,
                    name: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            customer: {
                select: {
                    name: true,
                    id: true,
                    profilePhoto: true,
                    email: true,
                },
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.review.count({
        where: {
            customer: {
                userId,
            },
            isDeleted: false, // Match the Vendor's `ownerId`
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: userReviews,
    };
});
const createReviewIntoDB = (userId, payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check is customer exists
    const isCustomerExists = yield prisma_1.default.customer.findFirst({
        where: { userId, isDeleted: false },
    });
    if (!isCustomerExists) {
        throw new ApiError_1.default(404, "Customer not found");
    }
    if (images && ((_a = images === null || images === void 0 ? void 0 : images.reviewImages) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        payload.images = images.reviewImages.map((image) => image.path);
    }
    else {
        payload.images = [];
    }
    payload.customerId = isCustomerExists.id;
    const result = yield prisma_1.default.review.create({
        data: payload,
    });
    return result;
});
const createPublicReviewIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("public review", payload);
    const result = yield prisma_1.default.review.create({
        data: payload,
    });
    return result;
});
// delete user reviews
const deleteUserReviewFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // is review exists
    const isReviewExists = yield prisma_1.default.review.findFirst({
        where: {
            isDeleted: false,
            id,
        },
    });
    if (!isReviewExists) {
        throw new ApiError_1.default(404, "Review not found!");
    }
    const result = yield prisma_1.default.review.update({
        where: {
            id,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.ReviewService = {
    getAllReviewsFromDB,
    getAllVendorProductsReviews,
    createReviewIntoDB,
    getProductSpecificReviews,
    getUserProductReview,
    deleteUserReviewFromDB,
    createPublicReviewIntoDB,
};

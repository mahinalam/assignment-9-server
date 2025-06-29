"use strict";
// import { FollowingShop, Shop } from "@prisma/client";
// import prisma from "../../../sharred/prisma";
// import { JwtPayload } from "jsonwebtoken";
// import { TImageFile } from "../../interfaces/file";
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
exports.ShopService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllShop = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.shop.findMany({
        where: {
            isDeleted: false,
            status: "ACTIVE",
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
        include: {
            product: true,
            followingShop: true,
            vendor: true,
        },
    });
    const total = yield prisma_1.default.shop.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const createShopIntoDB = (userId, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check is vendor exists or deleted
    const isVendorExists = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            vendor: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!isVendorExists) {
        throw new ApiError_1.default(404, "User not found");
    }
    if (isVendorExists.isDeleted) {
        throw new ApiError_1.default(400, "User already deleted");
    }
    if (image) {
        payload.logo = image.path;
    }
    payload.vendorId = (_a = isVendorExists.vendor) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield prisma_1.default.shop.create({
        data: payload,
    });
    return result;
});
// const getVendorShop = async (paginationOption:any, user: JwtPayload) => {
//     const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const result = await prisma.user.findUnique({
//     where: {
//       id: user?.userId,
//       isDeleted: false,
//     },
//         skip: skip,
//     take: limit,
//     orderBy: {
//       [sortBy || "createdAt"]: sortOrder || "desc",
//     },
//     select: {
//       vendor: {
//         select: {
//           shop: {
//             select: {
//               name: true,
//               id: true,
//               product: {
//                 where: {
//                   isDeleted: false,
//                 },
//                 include: {
//                   category: {
//                     select: {
//                       id: true,
//                       name: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
//   return result;
// };
const getVendorShop = (paginationOption, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.user.findFirst({
        where: {
            id: user === null || user === void 0 ? void 0 : user.userId,
            isDeleted: false,
        },
        select: {
            vendor: {
                select: {
                    shop: {
                        select: {
                            name: true,
                            id: true,
                            description: true,
                            logo: true,
                            product: {
                                where: {
                                    isDeleted: false,
                                },
                                select: {
                                    name: true,
                                    images: true,
                                    id: true,
                                    stock: true,
                                    price: true,
                                    discount: true,
                                    longDescription: true,
                                    shortDescription: true,
                                    category: {
                                        select: {
                                            name: true,
                                            id: true,
                                        },
                                    },
                                },
                                take: limit,
                                skip: skip,
                                orderBy: {
                                    [sortBy || "createdAt"]: sortOrder || "desc",
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.product.count({
        where: {
            isDeleted: false,
            shop: {
                vendor: {
                    userId: user.userId,
                },
            },
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
const followShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    // check is shop exist
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
        },
    });
    // is alreday following
    const result = yield prisma_1.default.followingShop.create({
        data: { userId, shopId },
    });
    return result;
});
const unFollowShopIntoDB = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userid", userId);
    console.log("shop", shopId);
    // check is shop exist
    yield prisma_1.default.shop.findFirstOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.followingShop.delete({
        where: {
            userId_shopId: {
                userId,
                shopId,
            },
            isDeleted: false,
        },
    });
    return result;
});
// get all folowing shop
const getAllFollowingShops = (userId, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.followingShop.findMany({
        where: {
            userId,
            isDeleted: false,
        },
        select: {
            userId: true,
            shop: {
                select: {
                    id: true,
                    address: true,
                    logo: true,
                    name: true,
                    createdAt: true,
                    status: true,
                },
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.followingShop.count({
        where: {
            userId,
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
// update shop
const updateShopIntoDB = (userId, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    // check is vendor exists or deleted
    const isVendorExists = yield prisma_1.default.vendor.findUnique({
        where: {
            userId,
        },
        select: {
            shop: {
                select: {
                    id: true,
                },
            },
            isDeleted: true,
        },
    });
    if (!isVendorExists) {
        throw new ApiError_1.default(404, "Vendor not found");
    }
    if (isVendorExists.isDeleted) {
        throw new ApiError_1.default(400, "Vendor already deleted");
    }
    if (image) {
        payload.logo = image.path;
    }
    const result = yield prisma_1.default.shop.update({
        where: {
            id: isVendorExists.shop.id,
        },
        data: payload,
    });
    return result;
});
const getIsFollowingShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const isFollowing = yield prisma_1.default.followingShop.findFirst({
        where: {
            userId,
            shopId,
            isDeleted: false,
        },
    });
    console.log("is following", isFollowing);
    if (isFollowing) {
        return { success: true };
    }
    else {
        return { success: false };
    }
});
// deletevendor reviews
const blockShopIntoDB = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopId,
            isDeleted: false,
        },
        data: {
            status: "BLOCKED",
        },
    });
    return result;
});
exports.ShopService = {
    getAllShop,
    createShopIntoDB,
    getVendorShop,
    followShop,
    blockShopIntoDB,
    updateShopIntoDB,
    getAllFollowingShops,
    unFollowShopIntoDB,
    getIsFollowingShop,
};

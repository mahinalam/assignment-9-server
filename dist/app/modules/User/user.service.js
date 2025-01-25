"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user alredat exists
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            isDeleted: false,
        },
    });
    if (isUserExists) {
        throw new ApiError_1.default(400, "User Alreday Exists!");
    }
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    const userData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
    const result = yield prisma_1.default.user.create({
        data: userData,
        select: {
            id: true,
            email: true,
            name: true,
            address: true,
            phoneNumber: true,
            role: true,
            shop: true,
            status: true,
            review: true,
        },
    });
    return result;
});
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany();
    return result;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            shop: true,
            review: true,
            followingShop: {
                include: {
                    shop: true,
                },
            },
        },
    });
    return result;
});
// admin stats
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.count();
    const orders = yield prisma_1.default.orderItem.count();
    const payments = yield prisma_1.default.order.count({
        where: {
            paymentStatus: "COMPLETED",
        },
    });
    const shops = yield prisma_1.default.shop.count();
    const category = yield prisma_1.default.category.count();
    const result = {
        products,
        orders,
        payments,
        shops,
        category,
    };
    return result;
});
// vendor stats
const getVendorStats = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch vendor-specific counts
    const [orderCount, completedPaymentsCount, followerCount, productCount] = yield Promise.all([
        // Total orders for this vendor's shop
        prisma_1.default.order.count({
            where: {
                shop: {
                    ownerId: vendorId,
                },
            },
        }),
        // Total completed payments for this vendor's shop
        prisma_1.default.order.count({
            where: {
                shop: {
                    ownerId: vendorId,
                },
                paymentStatus: "COMPLETED",
            },
        }),
        // Total followers for this vendor's shop
        prisma_1.default.followingShop.count({
            where: {
                shop: {
                    ownerId: vendorId,
                },
            },
        }),
        // Total products in the vendor's shop
        prisma_1.default.product.count({
            where: {
                shop: {
                    ownerId: vendorId,
                },
            },
        }),
    ]);
    // Return the counts
    return {
        totalOrders: orderCount,
        totalCompletedPayments: completedPaymentsCount,
        totalFollowers: followerCount,
        totalProducts: productCount,
    };
});
// user stats
const getUserStats = (customerEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch user-specific counts using customerEmail
    const [orderCount, followedShopsCount, reviewCount, cartItemsCount] = yield Promise.all([
        // Total orders placed by the user (customerEmail)
        prisma_1.default.order.count({
            where: {
                customerEmail: customerEmail,
            },
        }),
        // Total shops followed by the user (customerEmail)
        prisma_1.default.followingShop.count({
            where: {
                user: {
                    email: customerEmail,
                },
            },
        }),
        // Total reviews written by the user (customerEmail)
        prisma_1.default.review.count({
            where: {
                user: {
                    email: customerEmail,
                },
            },
        }),
        // Total cart items for the user (customerEmail)
        prisma_1.default.cartItem.count({
            where: {
                cart: {
                    customer: {
                        email: customerEmail,
                    },
                },
            },
        }),
    ]);
    // Return the counts
    return {
        totalOrders: orderCount,
        totalFollowedShops: followedShopsCount,
        totalReviews: reviewCount,
        totalCartItems: cartItemsCount,
    };
});
const updateMyProfile = (user, image) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("from backend user", user);
    console.log("from backend image", image);
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (image) {
        user.profilePhoto = image.path;
    }
    const result = yield prisma_1.default.user.update({
        where: {
            email: userInfo.email,
        },
        data: user,
    });
    return result;
});
exports.UserService = {
    getAllUsersFromDB,
    createUserIntoDB,
    getSingleUserFromDB,
    updateMyProfile,
    getAdminStats,
    getVendorStats,
    getUserStats,
};

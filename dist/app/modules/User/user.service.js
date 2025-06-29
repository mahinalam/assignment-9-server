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
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
// create customer
const createCustomerIntoDB = (userInfo, customerInfo) => __awaiter(void 0, void 0, void 0, function* () {
    // is user exists
    const isCustomerExists = yield prisma_1.default.user.findFirst({
        where: {
            email: userInfo.email,
            isDeleted: false,
        },
    });
    if (isCustomerExists) {
        throw new ApiError_1.default(400, "Customer Alreday Exists!");
    }
    const hashedPassword = yield bcrypt.hash(userInfo.password, 12);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield tx.user.create({
            data: {
                role: "CUSTOMER",
                email: userInfo.email,
                password: hashedPassword,
            },
        });
        const customerData = Object.assign(Object.assign({}, customerInfo), { userId: userData.id, email: userData.email });
        yield tx.customer.create({
            data: customerData,
        });
        // return customer;
        const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
            userId: userData.id,
            email: userData.email,
            role: userData.role,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
        return {
            accessToken,
        };
    }));
    return result;
});
// create vendor
const createVendorIntoDB = (userInfo, vendorInfo, shopInfo, shopImage) => __awaiter(void 0, void 0, void 0, function* () {
    // is vendor exists
    const isVendorExists = yield prisma_1.default.user.findFirst({
        where: {
            email: userInfo.email,
            isDeleted: false,
        },
    });
    if (isVendorExists) {
        throw new ApiError_1.default(400, "Vendor Alreday Exists!");
    }
    const hashedPassword = yield bcrypt.hash(userInfo.password, 12);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield tx.user.create({
            data: {
                role: "VENDOR",
                email: userInfo.email,
                password: hashedPassword,
            },
        });
        const vendorData = Object.assign(Object.assign({}, vendorInfo), { userId: userData.id, email: userData.email });
        const vendor = yield tx.vendor.create({
            data: vendorData,
        });
        if (shopInfo) {
            shopInfo.vendorId = vendor.id;
            shopInfo.logo = shopImage.path;
            yield tx.shop.create({
                data: shopInfo,
            });
        }
        const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
            userId: userData.id,
            email: userData.email,
            role: userData.role,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
        return {
            accessToken,
        };
    }));
    return result;
});
const getAllUsersFromDB = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.user.findMany({
        where: {
            isDeleted: false,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
        omit: {
            password: true,
        },
    });
    const total = yield prisma_1.default.user.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            customer: true,
            admin: true,
            vendor: true,
        },
        omit: {
            password: true,
        },
    });
    return result;
});
const updateMyProfile = (user, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === "CUSTOMER") {
        if (image) {
            payload.profilePhoto = image.path;
        }
        const result = yield prisma_1.default.customer.update({
            where: {
                email: user.email,
            },
            data: payload,
        });
        return result;
    }
    if (user.role === "VENDOR") {
        if (image) {
            payload.profilePhoto = image.path;
        }
        const result = yield prisma_1.default.vendor.update({
            where: {
                email: user.email,
            },
            data: payload,
        });
        return result;
    }
    if (user.role === "ADMIN") {
        if (image) {
            payload.profilePhoto = image.path;
        }
        const result = yield prisma_1.default.admin.update({
            where: {
                email: user.email,
            },
            data: payload,
        });
        return result;
    }
});
// subscription for first order
const subscriberUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user already  subscribed
    // const isSubscribed = await prisma.
});
// delete user
// deletevendor reviews
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(404, "User already deleted.");
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (isUserExists.role === "CUSTOMER") {
            console.log("is user exists", isUserExists);
            // delete customer
            yield tx.customer.update({
                where: {
                    userId: isUserExists.id,
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
            });
            const result = yield tx.user.update({
                where: {
                    id: isUserExists.id,
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
                omit: {
                    password: true,
                },
            });
            return result;
        }
        // delete vendor
        if (isUserExists.role === "VENDOR") {
            // delete customer
            yield tx.vendor.update({
                where: {
                    userId: isUserExists.id,
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
            });
            const result = yield tx.user.update({
                where: {
                    id: isUserExists.id,
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
                omit: {
                    password: true,
                },
            });
            return result;
        }
    }));
});
// vendor stats
const getVendorStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isVendorExists = yield prisma_1.default.vendor.findFirstOrThrow({
        where: {
            userId,
        },
    });
    // Fetch vendor-specific counts
    const [orderCount, completedPaymentsCount, followerCount, productCount] = yield Promise.all([
        // Total orders for this vendor's shop
        prisma_1.default.order.count({
            where: {
                shop: {
                    vendorId: isVendorExists.id,
                },
            },
        }),
        // Total completed payments for this vendor's shop
        prisma_1.default.order.count({
            where: {
                shop: {
                    vendorId: isVendorExists.id,
                },
                paymentStatus: "COMPLETED",
            },
        }),
        // Total followers for this vendor's shop
        prisma_1.default.followingShop.count({
            where: {
                shop: {
                    vendorId: isVendorExists.id,
                },
            },
        }),
        // Total products in the vendor's shop
        prisma_1.default.product.count({
            where: {
                shop: {
                    vendorId: isVendorExists.id,
                },
            },
        }),
    ]);
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
                customer: {
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
exports.UserService = {
    getAllUsersFromDB,
    createCustomerIntoDB,
    createVendorIntoDB,
    getSingleUserFromDB,
    updateMyProfile,
    deleteUserFromDB,
    getVendorStats,
    getUserStats,
    getAdminStats,
};

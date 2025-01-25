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
exports.ShopService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const getAllShop = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            followingShop: true,
            products: true,
        },
    });
    return result;
});
const createShopIntoDB = (vendorId, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    payload.logo = image.path;
    payload.ownerId = vendorId;
    const result = yield prisma_1.default.shop.create({
        data: payload,
    });
    return result;
});
const getVendorShop = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: user.userId,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phoneNumber: true,
            address: true,
            status: true,
            shop: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    logo: true,
                    address: true,
                    products: true,
                },
            },
        },
    });
    return result;
});
const followShop = (followerId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.followingShop.create({
        data: { followerId, shopId },
    });
    return result;
});
exports.ShopService = {
    getAllShop,
    createShopIntoDB,
    getVendorShop,
    followShop,
};

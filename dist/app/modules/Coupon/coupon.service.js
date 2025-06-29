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
exports.CouponService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createCouponIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is coupon exits
    const isCouponExists = yield prisma_1.default.coupon.findFirst({
        where: {
            code: payload.code,
            isDeleted: false,
        },
    });
    if (isCouponExists) {
        throw new ApiError_1.default(400, "Coupon alreday exists.");
    }
    const result = yield prisma_1.default.coupon.create({
        data: payload,
    });
    return result;
});
const applyCouponCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const isCouponExists = yield prisma_1.default.coupon.findFirst({
        where: {
            code,
            isDeleted: false,
        },
    });
    if (!isCouponExists) {
        throw new ApiError_1.default(404, "Invalid Coupon Code.");
    }
    // check the expire data
    const now = new Date();
    const expiration = new Date(isCouponExists.expiration);
    const isCouponExpired = now > expiration;
    if (isCouponExpired) {
        throw new ApiError_1.default(404, "Coupon expired date has been ended.");
    }
    return isCouponExists;
});
const getAllCoupon = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.coupon.findMany({
        where: { isDeleted: false },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.coupon.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// delete coupon
const deleteCouponFromDB = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.update({
        where: {
            id: couponId,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.CouponService = {
    createCouponIntoDB,
    getAllCoupon,
    applyCouponCode,
    deleteCouponFromDB,
};

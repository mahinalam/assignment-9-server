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
const createCouponIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
const getAllCoupon = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.findMany();
    return result;
});
exports.CouponService = {
    createCouponIntoDB,
    getAllCoupon,
    applyCouponCode,
};

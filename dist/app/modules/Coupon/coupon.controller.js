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
exports.CouponController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const coupon_service_1 = require("./coupon.service");
const pick_1 = __importDefault(require("../../../sharred/pick"));
const createCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponService.createCouponIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Coupon Created successfuly!",
        data: result,
    });
}));
const applyCouponCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { couponCode } = req.body;
    const result = yield coupon_service_1.CouponService.applyCouponCode(couponCode);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Coupon Code is Valid.",
        data: result,
    });
}));
const allCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield coupon_service_1.CouponService.getAllCoupon(paginationOption);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Coupons retrived successfully.",
        data: result,
    });
}));
// delete coupon
const deleteCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield coupon_service_1.CouponService.deleteCouponFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Coupon deleted successfuly!",
        data: result,
    });
}));
exports.CouponController = {
    createCoupon,
    applyCouponCode,
    allCoupon,
    deleteCoupon,
};

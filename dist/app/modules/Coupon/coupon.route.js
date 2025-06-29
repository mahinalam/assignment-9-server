"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoute = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", coupon_controller_1.CouponController.allCoupon);
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponController.createCoupon);
router.post("/code", (0, auth_1.default)(client_1.UserRole.CUSTOMER), coupon_controller_1.CouponController.applyCouponCode);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponController.deleteCoupon);
exports.CouponRoute = router;

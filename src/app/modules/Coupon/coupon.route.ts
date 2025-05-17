import express from "express";
import { CouponController } from "./coupon.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get("/", CouponController.allCoupon);
router.post("/", auth(UserRole.ADMIN), CouponController.createCoupon);
router.post("/", auth(UserRole.CUSTOMER), CouponController.applyCouponCode);
router.delete("/:id", auth(UserRole.ADMIN), CouponController.deleteCoupon);

export const CouponRoute = router;

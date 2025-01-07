import express, { NextFunction, Request, Response } from "express";
import { CouponController } from "./coupon.controller";
// import { userController } from "./user.controller";
// import auth from "../../middlewares/auth";
// // import { UserRole } from '@prisma/client';
// import { fileUploader } from "../../../helpars/fileUploader";
// import { userValidation } from "./user.validation";
const router = express.Router();

router.get("/", CouponController.allCoupon);
router.post("/", CouponController.createCoupon);
router.post("/code", CouponController.applyCouponCode);

// router.get(
//   "/",
//   // auth(UserRole.ADMIN),
//   CategoryController.getAllCategories
// );

export const CouponRoute = router;

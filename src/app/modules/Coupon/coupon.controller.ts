import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { CouponService } from "./coupon.service";
import pick from "../../../sharred/pick";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCouponIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon Created successfuly!",
    data: result,
  });
});

const applyCouponCode = catchAsync(async (req, res) => {
  const { couponCode } = req.body;
  const result = await CouponService.applyCouponCode(couponCode);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon Code is Valid.",
    data: result,
  });
});

const allCoupon = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await CouponService.getAllCoupon(paginationOption);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupons retrived successfully.",
    data: result,
  });
});

// delete coupon
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CouponService.deleteCouponFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon deleted successfuly!",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  applyCouponCode,
  allCoupon,
  deleteCoupon,
};

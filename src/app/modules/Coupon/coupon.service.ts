import { Coupon } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

const createCouponIntoDB = async (payload: Coupon) => {
  const result = await prisma.coupon.create({
    data: payload,
  });

  return result;
};

const applyCouponCode = async (code: string) => {
  const isCouponExists = await prisma.coupon.findFirst({
    where: {
      code,
      isDeleted: false,
    },
  });

  if (!isCouponExists) {
    throw new ApiError(404, "Invalid Coupon Code.");
  }

  // check the expire data
  const now = new Date();
  const expiration = new Date(isCouponExists.expiration);
  const isCouponExpired = now > expiration;

  if (isCouponExpired) {
    throw new ApiError(404, "Coupon expired date has been ended.");
  }

  return isCouponExists;
};

const getAllCoupon = async () => {
  const result = await prisma.coupon.findMany();
  return result;
};

export const CouponService = {
  createCouponIntoDB,
  getAllCoupon,
  applyCouponCode,
};

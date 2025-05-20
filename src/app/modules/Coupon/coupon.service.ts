import { Coupon } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createCouponIntoDB = async (payload: Coupon) => {
  // check is coupon exits
  const isCouponExists = await prisma.coupon.findFirst({
    where: {
      code: payload.code,
      isDeleted: false,
    },
  });

  if (isCouponExists) {
    throw new ApiError(400, "Coupon alreday exists.");
  }
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

const getAllCoupon = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.coupon.findMany({
    where: { isDeleted: false },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });
  const total = await prisma.coupon.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// delete coupon
const deleteCouponFromDB = async (couponId: string) => {
  const result = await prisma.coupon.update({
    where: {
      id: couponId,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const CouponService = {
  createCouponIntoDB,
  getAllCoupon,
  applyCouponCode,
  deleteCouponFromDB,
};

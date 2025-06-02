import { Order, OrderItem, WishlistItem } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { paginationHelper } from "../../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";

export const createWishlistIntoDB = async (userId: any, payload: any) => {
  const { productId } = payload;

  // check products
  await prisma.product.findFirstOrThrow({
    where: {
      isDeleted: false,
      id: productId,
    },
  });
  // Check if the wishlist already exists for the customer
  const wishlist = await prisma.wishlist.findFirst({
    where: { userId, productId, isDeleted: false },
  });
  if (wishlist) {
    throw new ApiError(400, "Product already added to wishlist.");
  }

  const result = await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });

  return result;
};

const getUsersWishlistsFromDB = async (
  paginationOption: any,
  userId: string
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.wishlist.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          price: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });
  const total = await prisma.wishlist.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const removeFromWishlistFromDB = async (userId: string, productId: string) => {
  // check is wishlist exists
  const isWishlistExists = await prisma.wishlist.findFirst({
    where: {
      userId,
      productId,
      isDeleted: false,
    },
  });

  if (!isWishlistExists) {
    throw new ApiError(404, "Wislist isn't exists.");
  }
  const result = await prisma.wishlist.delete({
    where: {
      userId,
      productId,
      isDeleted: false,
    },
  });
  return result;
};

export const WishListService = {
  createWishlistIntoDB,
  getUsersWishlistsFromDB,
  removeFromWishlistFromDB,
};

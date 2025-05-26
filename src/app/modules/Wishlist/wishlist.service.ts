import { Order, OrderItem, WishlistItem } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { paginationHelper } from "../../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";

export const createWishlistIntoDB = async (userId: any, payload: any) => {
  const { products } = payload;
  console.log("from order", payload);

  // Check if the wishlist already exists for the customer
  const wishlist = await prisma.wishlist.findFirst({
    where: { userId, isDeleted: false },
  });
  if (wishlist) {
    const itemsToCreate = products.map((item: WishlistItem) => ({
      wishlistId: wishlist.id,
      productId: item.productId,
    }));

    await prisma.wishlistItem.createMany({
      data: itemsToCreate,
    });
    return wishlist;
  } else {
    const result = await prisma.$transaction(async (tx) => {
      const wishlist = await tx.wishlist.create({
        data: {
          userId,
        },
      });

      const itemsToCreate = products.map((item: WishlistItem) => ({
        wishlistId: wishlist.id,
        productId: item.productId,
      }));

      await tx.wishlistItem.createMany({
        data: itemsToCreate,
      });

      return wishlist;
    });
    return result;
  }
};

const getUsersWishlistsFromDB = async (
  paginationOption: any,
  userId: string
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.wishlist.findFirst({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      id: true,
      wishlistItem: {
        where: { isDeleted: false },
        select: {
          createdAt: true,
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
      isDeleted: false,
      userId,
    },
  });

  if (!isWishlistExists) {
    throw new ApiError(404, "Wislist isn't exists.");
  }
  const result = await prisma.wishlistItem.update({
    where: {
      wishlistId_productId: {
        wishlistId: isWishlistExists.id,
        productId: productId,
      },
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const WishListService = {
  createWishlistIntoDB,
  getUsersWishlistsFromDB,
  removeFromWishlistFromDB,
};

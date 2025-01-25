import { Request } from "express";
import * as bcrypt from "bcrypt";
import { User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";

const createUserIntoDB = async (payload: User) => {
  // check if the user alredat exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isDeleted: false,
    },
  });

  if (isUserExists) {
    throw new ApiError(400, "User Alreday Exists!");
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      address: true,
      phoneNumber: true,
      role: true,
      shop: true,
      status: true,
      review: true,
    },
  });

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      shop: true,
      review: true,
      followingShop: {
        include: {
          shop: true,
        },
      },
    },
  });
  return result;
};

// admin stats
const getAdminStats = async () => {
  const products = await prisma.product.count();
  const orders = await prisma.orderItem.count();
  const payments = await prisma.order.count({
    where: {
      paymentStatus: "COMPLETED",
    },
  });
  const shops = await prisma.shop.count();
  const category = await prisma.category.count();
  const result = {
    products,
    orders,
    payments,
    shops,
    category,
  };
  return result;
};

// vendor stats
const getVendorStats = async (vendorId: string) => {
  // Fetch vendor-specific counts
  const [orderCount, completedPaymentsCount, followerCount, productCount] =
    await Promise.all([
      // Total orders for this vendor's shop
      prisma.order.count({
        where: {
          shop: {
            ownerId: vendorId,
          },
        },
      }),

      // Total completed payments for this vendor's shop
      prisma.order.count({
        where: {
          shop: {
            ownerId: vendorId,
          },
          paymentStatus: "COMPLETED",
        },
      }),

      // Total followers for this vendor's shop
      prisma.followingShop.count({
        where: {
          shop: {
            ownerId: vendorId,
          },
        },
      }),

      // Total products in the vendor's shop
      prisma.product.count({
        where: {
          shop: {
            ownerId: vendorId,
          },
        },
      }),
    ]);

  // Return the counts
  return {
    totalOrders: orderCount,
    totalCompletedPayments: completedPaymentsCount,
    totalFollowers: followerCount,
    totalProducts: productCount,
  };
};

// user stats
const getUserStats = async (customerEmail: string) => {
  // Fetch user-specific counts using customerEmail
  const [orderCount, followedShopsCount, reviewCount, cartItemsCount] =
    await Promise.all([
      // Total orders placed by the user (customerEmail)
      prisma.order.count({
        where: {
          customerEmail: customerEmail,
        },
      }),

      // Total shops followed by the user (customerEmail)
      prisma.followingShop.count({
        where: {
          user: {
            email: customerEmail,
          },
        },
      }),

      // Total reviews written by the user (customerEmail)
      prisma.review.count({
        where: {
          user: {
            email: customerEmail,
          },
        },
      }),

      // Total cart items for the user (customerEmail)
      prisma.cartItem.count({
        where: {
          cart: {
            customer: {
              email: customerEmail,
            },
          },
        },
      }),
    ]);

  // Return the counts
  return {
    totalOrders: orderCount,
    totalFollowedShops: followedShopsCount,
    totalReviews: reviewCount,
    totalCartItems: cartItemsCount,
  };
};

const updateMyProfile = async (user: User, image?: TImageFile) => {
  console.log("from backend user", user);
  console.log("from backend image", image);
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (image) {
    user.profilePhoto = image.path;
  }

  const result = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: user,
  });

  return result;
};

export const UserService = {
  getAllUsersFromDB,
  createUserIntoDB,
  getSingleUserFromDB,
  updateMyProfile,
  getAdminStats,
  getVendorStats,
  getUserStats,
};

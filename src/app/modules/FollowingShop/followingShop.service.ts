import { Category, FollowingShop, Shop, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { JwtPayload } from "jsonwebtoken";

const createFollowingShopIntoDB = async (payload: FollowingShop) => {
  const result = await prisma.followingShop.create({
    data: payload,
  });

  return result;
};

const getVendorShop = async (user: JwtPayload) => {
  // const email = await prisma.user.findFirst({
  //   where: {
  //     email: req.email
  //   }
  // })
  // const isUser = await prisma.user.findFirst({
  //   where: {
  //     email: user.email,
  //   },
  // });
  console.log("from service user", user);
  const result = await prisma.user.findUnique({
    where: {
      id: user.userId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      address: true,
      status: true,
      shop: {
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          address: true,
          products: true,
        },
      },
    },
  });
  console.log("result", result);
  return result;
};

export const FollowingShopService = {
  createFollowingShopIntoDB,
  // getVendorShop,
  //   createCustomer,
};

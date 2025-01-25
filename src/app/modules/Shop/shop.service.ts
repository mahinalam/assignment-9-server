import { FollowingShop, Shop } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { JwtPayload } from "jsonwebtoken";
import { TImageFile } from "../../interfaces/file";

const getAllShop = async () => {
  const result = await prisma.shop.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      followingShop: true,
      products: true,
    },
  });

  return result;
};

const createShopIntoDB = async (
  vendorId: string,
  payload: Shop,
  image: TImageFile
) => {
  payload.logo = image.path;
  payload.ownerId = vendorId;

  const result = await prisma.shop.create({
    data: payload,
  });

  return result;
};

const getVendorShop = async (user: JwtPayload) => {
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

  return result;
};

const followShop = async (followerId: string, shopId: string) => {
  const result = await prisma.followingShop.create({
    data: { followerId, shopId },
  });

  return result;
};

export const ShopService = {
  getAllShop,
  createShopIntoDB,
  getVendorShop,
  followShop,
};

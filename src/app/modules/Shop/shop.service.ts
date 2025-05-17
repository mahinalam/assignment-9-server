// import { FollowingShop, Shop } from "@prisma/client";
// import prisma from "../../../sharred/prisma";
// import { JwtPayload } from "jsonwebtoken";
// import { TImageFile } from "../../interfaces/file";

// const getAllShop = async () => {
//   const result = await prisma.shop.findMany({
//     where: {
//       isDeleted: false,
//     },
//     include: {
//       followingShop: true,
//       products: {
//         where: {
//           isDeleted: false,
//         },
//       },
//       owner: {
//         select: {
//           name: true,
//           email: true,
//           id: true,
//           profilePhoto: true,
//         },
//       },
//     },
//   });

//   return result;
// };

// const createShopIntoDB = async (
//   vendorId: string,
//   payload: Shop,
//   image: TImageFile
// ) => {
//   payload.logo = image.path;
//   payload.ownerId = vendorId;

//   const result = await prisma.shop.create({
//     data: payload,
//   });

//   return result;
// };

// const getVendorShop = async (user: JwtPayload) => {
//   console.log("user", user);
//   const result = await prisma.user.findUnique({
//     where: {
//       id: user?.userId,
//       isDeleted: false,
//     },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       phoneNumber: true,
//       address: true,
//       status: true,
//       shop: {
//         select: {
//           id: true,
//           name: true,
//           description: true,
//           logo: true,
//           address: true,
//           products: {
//             where: {
//               isDeleted: false,
//             },
//           },
//         },
//       },
//     },
//   });

//   return result;
// };

// const followShop = async (followerId: string, shopId: string) => {
//   const result = await prisma.followingShop.create({
//     data: { followerId, shopId },
//   });

//   return result;
// };

// export const ShopService = {
//   getAllShop,
//   createShopIntoDB,
//   getVendorShop,
//   followShop,
// };

import { FollowingShop, Shop } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { JwtPayload } from "jsonwebtoken";
import { TImageFile } from "../../interfaces/file";
import ApiError from "../../errors/ApiError";

const getAllShop = async () => {
  const result = await prisma.shop.findMany({
    where: {
      isDeleted: false,
      status: "ACTIVE",
    },
    include: {
      product: true,
      followingShop: true,
      vendor: true,
    },
  });

  return result;
};

const createShopIntoDB = async (
  userId: any,
  payload: Shop,
  image: TImageFile
) => {
  // check is vendor exists or deleted
  const isVendorExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      vendor: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!isVendorExists) {
    throw new ApiError(404, "User not found");
  }

  if (isVendorExists.isDeleted) {
    throw new ApiError(400, "User already deleted");
  }

  payload.logo = image.path;
  (payload as any).vendorId = isVendorExists.vendor?.id;

  const result = await prisma.shop.create({
    data: payload,
  });

  return result;
};

const getVendorShop = async (user: JwtPayload) => {
  const result = await prisma.user.findUnique({
    where: {
      id: user?.userId,
      isDeleted: false,
    },
    select: {
      vendor: {
        select: {
          shop: true,
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

// update shop
const updateShopIntoDB = async (
  userId: any,
  payload: Shop,
  image?: TImageFile
) => {
  // check is vendor exists or deleted
  const isVendorExists = await prisma.vendor.findUnique({
    where: {
      userId,
    },
    select: {
      shop: {
        select: {
          id: true,
        },
      },
      isDeleted: true,
    },
  });

  if (!isVendorExists) {
    throw new ApiError(404, "Vendor not found");
  }

  if (isVendorExists.isDeleted) {
    throw new ApiError(400, "Vendor already deleted");
  }

  if (image) {
    payload.logo = image.path;
  }

  const result = await prisma.shop.update({
    where: {
      id: isVendorExists.shop!.id,
    },
    data: payload,
  });

  return result;
};

// deletevendor reviews
const blockShopIntoDB = async (shopId: string) => {
  const result = await prisma.shop.update({
    where: {
      id: shopId,
      isDeleted: false,
    },
    data: {
      status: "BLOCKED",
    },
  });

  return result;
};

export const ShopService = {
  getAllShop,
  createShopIntoDB,
  getVendorShop,
  followShop,
  blockShopIntoDB,
  updateShopIntoDB,
};

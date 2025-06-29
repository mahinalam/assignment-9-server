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
import { paginationHelper } from "../../../helpers/paginationHelper";
import { getDefaultResultOrder } from "dns";

const getAllShop = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.shop.findMany({
    where: {
      isDeleted: false,
      status: "ACTIVE",
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    include: {
      product: true,
      followingShop: true,
      vendor: true,
    },
  });

  const total = await prisma.shop.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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
  if (image) {
    payload.logo = image.path;
  }
  (payload as any).vendorId = isVendorExists.vendor?.id;

  const result = await prisma.shop.create({
    data: payload,
  });

  return result;
};

// const getVendorShop = async (paginationOption:any, user: JwtPayload) => {
//     const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const result = await prisma.user.findUnique({
//     where: {
//       id: user?.userId,
//       isDeleted: false,
//     },
//         skip: skip,
//     take: limit,
//     orderBy: {
//       [sortBy || "createdAt"]: sortOrder || "desc",
//     },
//     select: {
//       vendor: {
//         select: {
//           shop: {
//             select: {
//               name: true,
//               id: true,

//               product: {
//                 where: {
//                   isDeleted: false,
//                 },
//                 include: {
//                   category: {
//                     select: {
//                       id: true,
//                       name: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },

//         },
//       },
//     },

//   });

//   return result;
// };
const getVendorShop = async (paginationOption: any, user: JwtPayload) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const result = await prisma.user.findFirst({
    where: {
      id: user?.userId,
      isDeleted: false,
    },
    select: {
      vendor: {
        select: {
          shop: {
            select: {
              name: true,
              id: true,
              description: true,
              logo: true,
              product: {
                where: {
                  isDeleted: false,
                },
                select: {
                  name: true,
                  images: true,
                  id: true,
                  stock: true,
                  price: true,
                  discount: true,
                  longDescription: true,
                  shortDescription: true,
                  category: {
                    select: {
                      name: true,
                      id: true,
                    },
                  },
                },
                take: limit,
                skip: skip,
                orderBy: {
                  [sortBy || "createdAt"]: sortOrder || "desc",
                },
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.product.count({
    where: {
      isDeleted: false,
      shop: {
        vendor: {
          userId: user.userId,
        },
      },
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const followShop = async (userId: string, shopId: string) => {
  // check is shop exist
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
    },
  });
  // is alreday following

  const result = await prisma.followingShop.create({
    data: { userId, shopId },
  });

  return result;
};

const unFollowShopIntoDB = async (userId: string, shopId: string) => {
  console.log("userid", userId);
  console.log("shop", shopId);
  // check is shop exist
  await prisma.shop.findFirstOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
  });
  const result = await prisma.followingShop.delete({
    where: {
      userId_shopId: {
        userId,
        shopId,
      },
      isDeleted: false,
    },
  });

  return result;
};

// get all folowing shop
const getAllFollowingShops = async (userId: string, paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.followingShop.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      userId: true,
      shop: {
        select: {
          id: true,
          address: true,
          logo: true,
          name: true,
          createdAt: true,
          status: true,
        },
      },
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.followingShop.count({
    where: {
      userId,
      isDeleted: false,
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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

const getIsFollowingShop = async (userId: string, shopId: string) => {
  const isFollowing = await prisma.followingShop.findFirst({
    where: {
      userId,
      shopId,
      isDeleted: false,
    },
  });
  console.log("is following", isFollowing);
  if (isFollowing) {
    return { success: true };
  } else {
    return { success: false };
  }
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
  getAllFollowingShops,
  unFollowShopIntoDB,
  getIsFollowingShop,
};

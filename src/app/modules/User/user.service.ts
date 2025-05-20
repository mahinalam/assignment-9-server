// import { Request } from "express";
// import * as bcrypt from "bcrypt";
// import { User, UserRole, UserStatus } from "@prisma/client";
// import prisma from "../../../sharred/prisma";
// import ApiError from "../../errors/ApiError";
// import { TImageFile } from "../../interfaces/file";

// // const createUserIntoDB = async (payload: User) => {
// //   // check if the user alredat exists
// //   const isUserExists = await prisma.user.findUnique({
// //     where: {
// //       email: payload.email,
// //       isDeleted: false,
// //     },
// //   });

// //   if (isUserExists) {
// //     throw new ApiError(400, "User Alreday Exists!");
// //   }
// //   const hashedPassword: string = await bcrypt.hash(payload.password, 12);

// //   const userData = {
// //     ...payload,
// //     password: hashedPassword,
// //   };

// //   const result = await prisma.user.create({
// //     data: userData,
// //     select: {
// //       id: true,
// //       email: true,
// //       name: true,
// //       address: true,
// //       phoneNumber: true,
// //       role: true,
// //       shop: true,
// //       status: true,
// //       review: true,
// //     },
// //   });

// //   return result;
// // };

// const createCustomerIntoDB = async (userInfo: any, customerInfo: any) => {
//   // is user exists
//   const isCustomerExists = await prisma.user.findUnique({
//     where: {
//       email: userInfo.data.email,
//       isDeleted: false,
//     },
//   });
//   if (isCustomerExists) {
//     throw new ApiError(400, "Customer Alreday Exists!");
//   }

//   const user: Partial<User> = {};
//   user.role = "CUSTOMER";
//   const result = prisma.$transaction(async (tx) => {
//     const user = await tx.user.create(userInfo);
//     const customerData = {
//       ...customerInfo,
//       userId: user.id,
//       email: user.email,
//     };
//     const customer = await tx.customer.create(customerData);
//     return customer;
//   });
//   return result;
// };

// const getAllUsersFromDB = async () => {
//   const result = await prisma.user.findMany({
//     where: {
//       isDeleted: false,
//     },
//   });
//   return result;
// };

// const getSingleUserFromDB = async (id: string) => {
//   const result = await prisma.user.findUniqueOrThrow({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     include: {
//       shop: true,
//       review: true,
//       followingShop: {
//         include: {
//           shop: true,
//         },
//       },
//     },
//   });
//   return result;
// };

// // admin stats
// const getAdminStats = async () => {
//   const products = await prisma.product.count();
//   const orders = await prisma.orderItem.count();
//   const payments = await prisma.order.count({
//     where: {
//       paymentStatus: "COMPLETED",
//     },
//   });
//   const shops = await prisma.shop.count();
//   const category = await prisma.category.count();
//   const result = {
//     products,
//     orders,
//     payments,
//     shops,
//     category,
//   };
//   return result;
// };

// // vendor stats
// const getVendorStats = async (vendorId: string) => {
//   // Fetch vendor-specific counts
//   const [orderCount, completedPaymentsCount, followerCount, productCount] =
//     await Promise.all([
//       // Total orders for this vendor's shop
//       prisma.order.count({
//         where: {
//           shop: {
//             ownerId: vendorId,
//           },
//         },
//       }),

//       // Total completed payments for this vendor's shop
//       prisma.order.count({
//         where: {
//           shop: {
//             ownerId: vendorId,
//           },
//           paymentStatus: "COMPLETED",
//         },
//       }),

//       // Total followers for this vendor's shop
//       prisma.followingShop.count({
//         where: {
//           shop: {
//             ownerId: vendorId,
//           },
//         },
//       }),

//       // Total products in the vendor's shop
//       prisma.product.count({
//         where: {
//           shop: {
//             ownerId: vendorId,
//           },
//         },
//       }),
//     ]);

//   // Return the counts
//   return {
//     totalOrders: orderCount,
//     totalCompletedPayments: completedPaymentsCount,
//     totalFollowers: followerCount,
//     totalProducts: productCount,
//   };
// };

// // user stats
// const getUserStats = async (customerEmail: string) => {
//   // Fetch user-specific counts using customerEmail
//   const [orderCount, followedShopsCount, reviewCount, cartItemsCount] =
//     await Promise.all([
//       // Total orders placed by the user (customerEmail)
//       prisma.order.count({
//         where: {
//           customerEmail: customerEmail,
//         },
//       }),

//       // Total shops followed by the user (customerEmail)
//       prisma.followingShop.count({
//         where: {
//           user: {
//             email: customerEmail,
//           },
//         },
//       }),

//       // Total reviews written by the user (customerEmail)
//       prisma.review.count({
//         where: {
//           user: {
//             email: customerEmail,
//           },
//         },
//       }),

//       // Total cart items for the user (customerEmail)
//       prisma.cartItem.count({
//         where: {
//           cart: {
//             customer: {
//               email: customerEmail,
//             },
//           },
//         },
//       }),
//     ]);

//   // Return the counts
//   return {
//     totalOrders: orderCount,
//     totalFollowedShops: followedShopsCount,
//     totalReviews: reviewCount,
//     totalCartItems: cartItemsCount,
//   };
// };

// const updateMyProfile = async (
//   email: string,
//   payload: any,
//   image?: TImageFile
// ) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   if (image) {
//     payload.profilePhoto = image.path;
//   }

//   const result = await prisma.user.update({
//     where: {
//       email: userInfo.email,
//     },
//     data: payload,
//   });

//   return result;
// };

// // subscription for first order
// const subscriberUser = async (email: string) => {
//   // check if the user already  subscribed
//   // const isSubscribed = await prisma.
// };

// // delete user
// // deletevendor reviews
// const deleteUserFromDB = async (id: string) => {
//   const result = await prisma.user.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: {
//       isDeleted: true,
//     },
//   });

//   return result;
// };

// export const UserService = {
//   getAllUsersFromDB,
//   createUserIntoDB,
//   getSingleUserFromDB,
//   updateMyProfile,
//   getAdminStats,
//   getVendorStats,
//   getUserStats,
//   deleteUserFromDB,
// };

import { Request } from "express";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { paginationHelper } from "../../../helpers/paginationHelper";

// create customer
const createCustomerIntoDB = async (userInfo: any, customerInfo: any) => {
  // is user exists
  const isCustomerExists = await prisma.user.findFirst({
    where: {
      email: userInfo.email,
      isDeleted: false,
    },
  });
  if (isCustomerExists) {
    throw new ApiError(400, "Customer Alreday Exists!");
  }
  const hashedPassword: string = await bcrypt.hash(userInfo.password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const userData = await tx.user.create({
      data: {
        role: "CUSTOMER",
        email: userInfo.email,
        password: hashedPassword,
      },
    });
    const customerData = {
      ...customerInfo,
      userId: userData.id,
      email: userData.email,
    };
    console.log("customerData", customerData);
    const customer = await tx.customer.create({
      data: customerData,
    });
    return customer;
  });
  return result;
};

// create vendor
const createVendorIntoDB = async (userInfo: any, vendorInfo: any) => {
  // is vendor exists
  const isVendorExists = await prisma.user.findFirst({
    where: {
      email: userInfo.email,
      isDeleted: false,
    },
  });
  if (isVendorExists) {
    throw new ApiError(400, "Vendor Alreday Exists!");
  }
  const hashedPassword: string = await bcrypt.hash(userInfo.password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const userData = await tx.user.create({
      data: {
        role: "VENDOR",
        email: userInfo.email,
        password: hashedPassword,
      },
    });
    const vendorData = {
      ...vendorInfo,
      userId: userData.id,
      email: userData.email,
    };

    const vendor = await tx.vendor.create({
      data: vendorData,
    });
    return vendor;
  });
  return result;
};

const getAllUsersFromDB = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    omit: {
      password: true,
    },
  });
  const total = await prisma.user.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      customer: true,
      admin: true,
      vendor: true,
    },
    omit: {
      password: true,
    },
  });
  return result;
};

const updateMyProfile = async (user: any, payload: any, image?: TImageFile) => {
  if (user.role === "CUSTOMER") {
    if (image) {
      payload.profilePhoto = image.path;
    }
    const result = await prisma.customer.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
    return result;
  }

  if (user.role === "VENDOR") {
    if (image) {
      payload.profilePhoto = image.path;
    }
    const result = await prisma.vendor.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
    return result;
  }
  if (user.role === "ADMIN") {
    if (image) {
      payload.profilePhoto = image.path;
    }
    const result = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
    return result;
  }
};

// subscription for first order
const subscriberUser = async (email: string) => {
  // check if the user already  subscribed
  // const isSubscribed = await prisma.
};

// delete user
// deletevendor reviews
const deleteUserFromDB = async (userId: string) => {
  // check if user exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isUserExists) {
    throw new ApiError(404, "User already deleted.");
  }

  await prisma.$transaction(async (tx) => {
    if (isUserExists.role === "CUSTOMER") {
      console.log("is user exists", isUserExists);
      // delete customer
      await tx.customer.update({
        where: {
          userId: isUserExists.id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      });

      const result = await tx.user.update({
        where: {
          id: isUserExists.id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
        omit: {
          password: true,
        },
      });
      return result;
    }

    // delete vendor
    if (isUserExists.role === "VENDOR") {
      // delete customer
      await tx.vendor.update({
        where: {
          userId: isUserExists.id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      });

      const result = await tx.user.update({
        where: {
          id: isUserExists.id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
        omit: {
          password: true,
        },
      });
      return result;
    }
  });
};

export const UserService = {
  getAllUsersFromDB,
  createCustomerIntoDB,
  createVendorIntoDB,
  getSingleUserFromDB,
  updateMyProfile,
  deleteUserFromDB,
};

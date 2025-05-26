import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../sharred/prisma";
import { TImageFile, TImageFiles } from "../../interfaces/file";
import ApiError from "../../errors/ApiError";

// / get all product specific reviews from db
// const getProductSpecificReviews = async (productId: string) => {
//   const result = await prisma.product.findUniqueOrThrow({
//     where: {
//       id: productId,
//       isDeleted: false,
//     },
//     include: {
//       review: true,
//     },
//   });

//   const reviews = result.review;
//   const reviewCounts = await prisma.review.groupBy({
//     by: ["rating"],
//     where: {
//       productId: productId,
//       isDeleted: false,
//     },
//     _count: true,
//   });

//   const totalReviews = reviews.length;
//   const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//   const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

//   return {
//     reviews,
//     reviewCounts,
//     averageRating,
//   };
// };

// get all reviews
const getAllReviewsFromDB = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.review.findMany({
    where: {
      isDeleted: false,
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    select: {
      rating: true,
      id: true,
      customer: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      product: {
        select: {
          name: true,
          images: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  const total = await prisma.review.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get  product specific reviews
const getProductSpecificReviews = async (
  fieldParams: any,
  paginationOption: any
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const { productId, rating } = fieldParams;

  const andCondition: Prisma.ReviewWhereInput[] = [];

  // Search functionality
  // if (searchTerm) {
  //   andCondition.push({
  //     OR: productSearchAbleFields.map((field) => ({
  //       [field]: {
  //         contains: searchTerm,
  //         mode: "insensitive",
  //       },
  //     })),
  //   });
  // }

  // Filter by specific fields
  if (productId) {
    andCondition.push({
      productId,
    });
  }

  if (rating) {
    andCondition.push({ rating: Number(rating) });
  }

  console.log("query review", andCondition);
  // // Add any additional filters from fieldParams
  // if (Object.keys(otherFilters)?.length > 0) {
  //   andCondition.push({
  //     AND: Object.keys(otherFilters).map((key) => ({
  //       [key]: {
  //         equals: otherFilters[key],
  //       },
  //     })),
  //   });
  // }

  // Combine all conditions
  const whereCondition: Prisma.ReviewWhereInput = {
    AND: andCondition,
  };

  // Query database
  const result = await prisma.review.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    include: {
      customer: {
        select: {
          email: true,
          name: true,
          profilePhoto: true,
          id: true,
        },
      },
    },
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.review.count({
    where: whereCondition,
  });

  const aggregateRating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: { result, aggregateRating },
  };
};

const getAllVendorProductsReviews = async (
  paginationOption: any,
  email: string
) => {
  // check is vendor exits
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const isVendorExists = await prisma.vendor.findUnique({
    where: {
      email,
      isDeleted: false,
    },
    select: {
      shop: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!isVendorExists) {
    throw new ApiError(404, "Vendor not found");
  }

  const vendorProducts = await prisma.review.findMany({
    where: {
      shopId: isVendorExists?.shop?.id,
      isDeleted: false, // Match the Vendor's `ownerId`
    },
    include: {
      product: {
        omit: {
          isDeleted: true,
          isFeatured: true,
          isFlashed: true,
          createdAt: true,
          updatedAt: true,
          shopId: true,
          brandId: true,
          categoryId: true,
        },
      },
      customer: {
        select: {
          email: true,
        },
      },
    },
    omit: {
      customerId: true,
      productId: true,
      shopId: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    skip: skip,
    take: limit,

    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.review.count({
    where: {
      shopId: isVendorExists?.shop?.id,
      isDeleted: false, // Match the Vendor's `ownerId`
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: vendorProducts,
  };
};

// const getUserProductReview = async (
//   customerId: string,
//   paginationOption: any
// ) => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const userReviews = await prisma.review.findMany({
//     where: {
//       customerId,
//       isDeleted: false, // Match the Vendor's `ownerId`
//     },
//     select: {
//       id: true,
//       images: true,
//       createdAt: true,
//       rating: true,
//       product: {
//         select: {
//           id: true,
//           images: true,
//           name: true,
//           category: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       },
//       customer: {
//         select: {
//           name: true,
//           id: true,
//           profilePhoto: true,
//         },
//       },
//     },
//     skip: skip,
//     take: limit,

//     orderBy: {
//       [sortBy || "createdAt"]: sortOrder || "desc",
//     },
//   });

//   const total = await prisma.review.count({
//     where: {
//       customerId,
//       isDeleted: false, // Match the Vendor's `ownerId`
//     },
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: userReviews,
//   };
// };

const getUserProductReview = async (userId: string, paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const userReviews = await prisma.review.findMany({
    where: {
      customer: {
        userId,
      },
      isDeleted: false,
    },
    select: {
      id: true,
      images: true,
      createdAt: true,
      rating: true,
      comment: true,
      product: {
        select: {
          id: true,
          images: true,
          name: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      customer: {
        select: {
          name: true,
          id: true,
          profilePhoto: true,
          email: true,
        },
      },
    },
    skip: skip,
    take: limit,

    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.review.count({
    where: {
      customer: {
        userId,
      },
      isDeleted: false, // Match the Vendor's `ownerId`
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: userReviews,
  };
};

const createReviewIntoDB = async (
  userId: string,
  payload: any,
  images?: TImageFiles
) => {
  // check is customer exists
  const isCustomerExists = await prisma.customer.findFirst({
    where: { userId, isDeleted: false },
  });

  if (!isCustomerExists) {
    throw new ApiError(404, "Customer not found");
  }

  if (images && images?.reviewImages?.length > 0) {
    payload.images = images.reviewImages.map((image: TImageFile) => image.path);
  } else {
    payload.images = [];
  }
  payload.customerId = isCustomerExists.id;
  const result = await prisma.review.create({
    data: payload,
  });

  return result;
};

const createPublicReviewIntoDB = async (payload: any) => {
  console.log("public review", payload);
  const result = await prisma.review.create({
    data: payload,
  });

  return result;
};

// delete user reviews
const deleteUserReviewFromDB = async (id: string) => {
  // is review exists
  const isReviewExists = await prisma.review.findFirst({
    where: {
      isDeleted: false,
      id,
    },
  });

  if (!isReviewExists) {
    throw new ApiError(404, "Review not found!");
  }

  const result = await prisma.review.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

// delete user reviews
// const deleteUserReviewFromDB = async (id: string) => {
//   // is review exists
//   const isReviewExists = await prisma.review.findFirst({
//     where: {
//       isDeleted: false,
//       id,
//     },
//   });

//   if (!isReviewExists) {
//     throw new ApiError(404, "Review not found!");
//   }

//   const result = await prisma.review.update({
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

export const ReviewService = {
  getAllReviewsFromDB,
  getAllVendorProductsReviews,
  createReviewIntoDB,
  getProductSpecificReviews,
  getUserProductReview,
  deleteUserReviewFromDB,
  createPublicReviewIntoDB,
};

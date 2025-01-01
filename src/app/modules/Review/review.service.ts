import { Category, Review, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile, TImageFiles } from "../../interfaces/file";

// get all product specific reviews from db
// const getProductSpecificReviews = async (productId: string) => {
//   await prisma.product.findUniqueOrThrow({
//     where: {
//       id: productId,
//       isDeleted: false,
//     },
//   });

//   const result = await prisma.review.findMany({
//     where: {
//       productId,
//       isDeleted: false,
//     },
//     // include: {
//     //   user: true,
//     // },
//   });
//   return result;
// };

// / get all product specific reviews from db
const getProductSpecificReviews = async (productId: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
    include: {
      review: true,
    },
  });

  const reviews = result.review;

  const reviewCounts = await prisma.review.groupBy({
    by: ["rating"],
    where: {
      productId: productId,
      isDeleted: false,
    },
    _count: true,
  });

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  return {
    reviews,
    reviewCounts, // Counts of reviews per rating
    averageRating, // Average rating for the product
  };
};

const getAllVendorProductsReviews = async (ownerId: string) => {
  // await prisma.product.findUniqueOrThrow({
  //   where: {
  //     id: vendorId,
  //     isDeleted: false,
  //   },
  // });

  // const result = await prisma.review.findMany({
  //   where: {
  //     productId,
  //     isDeleted: false,
  //   },
  // });
  // return result;
  const vendorProducts = await prisma.shop.findUnique({
    where: {
      ownerId, // Match the Vendor's `ownerId`
    },
    include: {
      products: {
        include: {
          review: {
            select: {
              rating: true,
              comment: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return vendorProducts;
};

const getUserProductReview = async (userId: string) => {
  const vendorProducts = await prisma.review.findMany({
    where: {
      userId, // Match the Vendor's `ownerId`
    },
    include: {
      product: true,
    },
  });

  return vendorProducts;
};

const createReviewIntoDB = async (payload: any, images?: TImageFiles) => {
  if (images && images.reviewImages.length > 0) {
    payload.images = images.reviewImages.map((image: TImageFile) => image.path);
  } else {
    payload.images = [];
  }

  const result = await prisma.review.create({
    data: payload,
  });

  return result;
};

export const ReviewService = {
  getAllVendorProductsReviews,
  createReviewIntoDB,
  getProductSpecificReviews,
  getUserProductReview,
  //   createCustomer,
};

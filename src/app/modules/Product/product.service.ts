import { TImageFiles } from "../../interfaces/file";
import { Prisma, Product } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { productSearchAbleFields } from "./product.constant";

// const getAllProductsFromDB = async (
//   fieldParams: any,
//   paginationOption: any
// ) => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const { searchTerm, ...filterData } = fieldParams;
//   console.log("from service", filterData);
//   const andCondition: Prisma.ProductWhereInput[] = [];

//   // search params
//   if (fieldParams.searchTerm) {
//     andCondition.push({
//       OR: productSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: fieldParams.searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   // specific field
//   if (Object.keys(filterData)?.length > 0) {
//     andCondition.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: filterData[key],
//         },
//       })),
//     });
//   }

//   const whereCondition: Prisma.ProductWhereInput = { AND: andCondition };

//   const result = await prisma.product.findMany({
//     where: whereCondition,
//     skip: skip,
//     take: limit,
//     include: {
//       review: true,
//     },
//   });

//   const total = await prisma.product.count({
//     where: whereCondition,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// const getAllProductsFromDB = async (
//   rating,
//   brandId,
//   categoryId,
//   priceMin,
//   priceMax,
//   searchTerm,
//   sortOrder,
//   page,
//   limit
// ) => {
//   // const products = await prisma.product.findMany({
//   //   where: {
//   //     AND: [
//   //       brandId ? { brandId } : {},
//   //       categoryId ? { categoryId } : {},
//   //       priceMin || priceMax
//   //         ? {
//   //             newPrice: {
//   //               gte: priceMin || undefined,
//   //               lte: priceMax || undefined,
//   //             },
//   //           }
//   //         : {},
//   //       rating
//   //         ? {
//   //             review: {
//   //               some: {
//   //                 rating: {
//   //                   gte: rating,
//   //                 },
//   //               },
//   //             },
//   //           }
//   //         : {},
//   //       searchTerm
//   //         ? {
//   //             OR: [
//   //               {
//   //                 name: {
//   //                   contains: searchTerm,
//   //                   mode: "insensitive", // Case-insensitive search
//   //                 },
//   //               },
//   //               {
//   //                 description: {
//   //                   contains: searchTerm,
//   //                   mode: "insensitive",
//   //                 },
//   //               },
//   //             ],
//   //           }
//   //         : {},
//   //     ],
//   //   },
//   //   include: {
//   //     category: true,
//   //     review: true,
//   //     brand: true,
//   //   },
//   // });

//   const whereInput = [];
//   if()

//   return products;
// };

const getAllProductsFromDB = async (
  fieldParams: any,
  paginationOption: any
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const { searchTerm, priceMin, priceMax, rating, brandId, categoryId } =
    fieldParams;

  const andCondition: Prisma.ProductWhereInput[] = [];

  // Search functionality
  if (searchTerm) {
    andCondition.push({
      OR: productSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter by specific fields
  if (priceMin || priceMax) {
    andCondition.push({
      AND: [
        priceMin ? { newPrice: { gte: parseInt(priceMin, 10) } } : {},
        priceMax ? { newPrice: { lte: parseInt(priceMax, 10) } } : {},
      ],
    });
  }

  if (rating) {
    andCondition.push({
      review: {
        some: {
          rating: {
            gte: parseInt(rating, 10),
          },
        },
      },
    });
  }

  if (brandId) {
    andCondition.push({ brandId: brandId });
  }

  if (categoryId) {
    andCondition.push({ categoryId });
  }

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
  const whereCondition: Prisma.ProductWhereInput = {
    AND: andCondition,
  };

  // Query database
  const result = await prisma.product.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    include: {
      review: true,
      brand: true,
      category: true,
      shop: true,
    },
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.product.count({
    where: whereCondition,
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

const createProductIntoDB = async (payload: Product, images: TImageFiles) => {
  console.log("images", images);
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);
  const result = await prisma.product.create({
    data: payload,
  });

  return result;
};

// get all vendor shop products
const getVendorShopProductsFromDB = async (shopId: string) => {
  const result = await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
    include: {
      products: {
        include: {
          review: true,
        },
      },
      followingShop: true,
    },
  });
  return result;
};

// get single  product from db
const getSingleProductFromDB = async (productId: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
    include: {
      shop: true,
      review: {
        select: {
          comment: true,
          createdAt: true,
          id: true,
          images: true,
          rating: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const updateVendorProductIntoDB = async (
  id: string,
  payload: Partial<Product>
) => {
  const result = await prisma.product.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });

  return result;
};

const deleteVendorProductFromDB = async (id: string) => {
  const result = await prisma.product.update({
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

export const ProductService = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  createProductIntoDB,
  getVendorShopProductsFromDB,
  updateVendorProductIntoDB,
  deleteVendorProductFromDB,
};

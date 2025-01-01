import { TImageFiles } from "../../interfaces/file";
import * as bcrypt from "bcrypt";
import { Prisma, Product } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { off } from "process";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { productSearchAbleFields } from "./product.constant";

// get all products from db
// const getAllProductsFromDB = async (params: {
//   searchTerms?: string[];
//   sortBy?: "name" | "price";
//   sortOrder?: "asc" | "desc";
// }) => {
//   // const andOptions = Prisma.AdminWhereInput[]
//   const { searchTerms, sortBy = 'name', sortOrder = 'asc' } = params;

// //   const result = await prisma.product.findMany({
// //     where: {
// //       isDeleted: false,
// //     },
// //     include: {
// //       review: true,
// //     },
// //   });
// //   console.log(result);
// //   return result;

// const result = await prisma.product.findMany({
//   where: {
//     isDeleted: false,
//     AND: searchTerms?.length ? [
//       {OR: searchTerms?.map((term) => ({
//         name: {
//           contains: term,
//           mode: 'insensitive'
//         }
//       }))}
//     ]
//   }
// })

// };

// const getAllProductsFromDB = async (params: {
//   searchTerms?: string[];  // searchTerms is now an array of strings
//   sortBy?: 'name' | 'price';
//   sortOrder?: 'asc' | 'desc';
//   searchFields?: string[];  // Optional: allows dynamic search on different fields
// }) => {
//   const { searchTerms, sortBy = 'name', sortOrder = 'asc', searchFields = ['name', 'description'] } = params;

//   // Generate search conditions for each field
//   const searchConditions = searchFields.flatMap((field) =>
//     searchTerms?.map((term) => ({
//       [field]: {
//         contains: term,
//         mode: 'insensitive',  // Case-insensitive search
//       },
//     }))
//   );

//   const result = await prisma.product.findMany({
//     where: {
//       isDeleted: false,
//       AND: searchTerms?.length ? { OR: searchConditions } : [],
//     },
//     orderBy: {
//       [sortBy]: sortOrder,  // Sorting by name or price
//     },
//     include: {
//       review: true,
//     },
//   });

//   console.log(result);
//   return result;
// };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["var(--font-sans)"],
//         mono: ["var(--font-mono)"],
//       },
//     },
//   },
//   darkMode: "class",
//   plugins: [require('@nextui-org/theme')], // Use 'require' to properly add the plugin
// }

// const getAllProductsFromDB = async (params: {
//   searchTerms?: string[]; // searchTerms is now an array of strings
//   sortBy?: "name" | "newPrice";
//   sortOrder?: "asc" | "desc";
//   searchFields?: string[]; // Optional: allows dynamic search on different fields
// }) => {
//   const {
//     searchTerms,
//     sortBy = "name",
//     sortOrder = "asc",
//     searchFields = ["name", "description"],
//   } = params;

//   // Generate search conditions for each field
//   const searchConditions = searchFields.flatMap(
//     (field) =>
//       searchTerms?.map((term) => ({
//         [field]: {
//           contains: term,
//           mode: "insensitive", // Case-insensitive search
//         },
//       })) ?? [] // Ensure the result is never undefined
//   );

//   const result = await prisma.product.findMany({
//     where: {
//       isDeleted: false,
//       AND: searchTerms?.length ? { OR: searchConditions.filter(Boolean) } : [],
//     },
//     orderBy: {
//       [sortBy]: sortOrder, // Sorting by name or price
//     },
//     include: {
//       review: true,
//     },
//   });

//   return result;
// };

// const getAllProductsFromDB = async (params: {
//   searchTerms?: string[]; // searchTerms is now an array of strings
//   sortBy?: "name" | "newPrice";
//   sortOrder?: "asc" | "desc";
//   searchFields?: string[]; // Optional: allows dynamic search on different fields
// }) => {
//   const {
//     searchTerms,
//     sortBy = "name",
//     sortOrder = "asc",
//     searchFields = ["name", "description"],
//   } = params;

//   // Generate search conditions for each field
//   const searchConditions = searchFields.flatMap(
//     (field) =>
//       searchTerms?.map((term) => ({
//         [field]: {
//           contains: term,
//           mode: "insensitive", // Case-insensitive search
//         },
//       })) ?? [] // Ensure the result is never undefined
//   );

//   const result = await prisma.product.findMany({
//     where: {
//       isDeleted: false,
//       AND: searchTerms?.length ? { OR: searchConditions.filter(Boolean) } : [],
//     },
//     orderBy: {
//       [sortBy]: sortOrder, // Sorting by name or price
//     },
//     include: {
//       review: true,
//     },
//   });

//   console.log(result);
//   return result;
// };

// const getAllProductsFromDB = async () => {
//   const result = await prisma.product.findMany({
//     include: {
//       category: true,
//       shop: true,
//       brand: true,
//     },
//   });
//   return result;
// };
//   const { limit, page, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, rating, priceMax, priceMin, brand } = filters;
//   console.log({ searchTerm, rating, priceMax, priceMin, brand });
//   const andConditions = [];
//   if (searchTerm) {
//     andConditions.push({
//       OR: productSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   if (rating) {
//     andConditions.push({
//       review: {
//         some: {
//           rating: {
//             gte: rating, // Minimum rating
//           },
//         },
//       },
//     });
//   }

//   if (priceMin) {
//     andConditions.push({
//       newPrice: {
//         gte: priceMin, // Minimum price
//       },
//     });
//   }

//   // Filter by maximum price
//   if (priceMax) {
//     andConditions.push({
//       newPrice: {
//         lte: priceMax, // Maximum price
//       },
//     });
//   }
//   console.log({ andConditions });
//   const whereConditions =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.product.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? { [options.sortBy]: options.sortOrder }
//         : { createdAt: "desc" },
//     include: {
//       review: true,
//       brand: true,
//     },
//   });
//   return result;
// };

const getAllProductsFromDB = async (
  fieldParams: any,
  paginationOption: any
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const { searchTerm, ...filterData } = fieldParams;

  const andCondition: Prisma.ProductWhereInput[] = [];

  // search params
  if (fieldParams.searchTerm) {
    andCondition.push({
      OR: productSearchAbleFields.map((field) => ({
        [field]: {
          contains: fieldParams.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // specific field
  if (Object.keys(filterData)?.length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.ProductWhereInput = { AND: andCondition };

  const result = await prisma.product.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
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
      products: true,
      followingShop: true,
    },
    // select: {
    //   id: true,
    //   address: true,
    //   description: true,
    //   logo: true,
    //   name: true,
    //   ownerId: true,
    //   products: {
    //     select: {
    //       id: true,
    //       category: true,
    //       images: true,
    //       name: true,
    //       newPrice: true,
    //       oldPrice: true,
    //       disCounts: true,
    //       review: {
    //         select: {
    //           id: true,
    //           images: true,
    //           rating: true,
    //           user: true,
    //           comment: true,
    //         },
    //       },
    //     },
    //   },
    // },
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

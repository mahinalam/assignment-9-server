import { TImageFiles } from "../../interfaces/file";
import * as bcrypt from "bcrypt";
import { Prisma, Product } from "@prisma/client";
import prisma from "../../../sharred/prisma";

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

const getAllProductsFromDB = async (params: {
  searchTerms?: string[]; // searchTerms is now an array of strings
  sortBy?: "name" | "newPrice";
  sortOrder?: "asc" | "desc";
  searchFields?: string[]; // Optional: allows dynamic search on different fields
}) => {
  const {
    searchTerms,
    sortBy = "name",
    sortOrder = "asc",
    searchFields = ["name", "description"],
  } = params;

  // Generate search conditions for each field
  const searchConditions = searchFields.flatMap(
    (field) =>
      searchTerms?.map((term) => ({
        [field]: {
          contains: term,
          mode: "insensitive", // Case-insensitive search
        },
      })) ?? [] // Ensure the result is never undefined
  );

  const result = await prisma.product.findMany({
    where: {
      isDeleted: false,
      AND: searchTerms?.length ? { OR: searchConditions.filter(Boolean) } : [],
    },
    orderBy: {
      [sortBy]: sortOrder, // Sorting by name or price
    },
    include: {
      review: true,
    },
  });

  console.log(result);
  return result;
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
    //   select: {
    //     description: true,
    //     disCounts: true,
    //     isFlash: true,
    //     images: true,
    //     id: true,
    //     name: true,
    //     newPrice: true,
    //     oldPrice: true,
    //     stock: true,
    //     review: {
    //       select: {
    //         comment: true,
    //         id: true,
    //         images: true,
    //         createdAt: true,
    //         rating: true,
    //         user: {
    //           select: {
    //             name: true,
    //           },
    //         },
    //       },
    //     },
    //     shop: {
    //       select: {
    //         address: true,
    //         description: true,
    //         id: true,
    //         logo: true,
    //         name: true,
    //         // owner: {
    //         //   select: {

    //         //   }
    //         // }
    //       },
    //     },
    //   },
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

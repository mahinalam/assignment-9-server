"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
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
const getAllProductsFromDB = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerms, sortBy = "name", sortOrder = "asc", searchFields = ["name", "description"], } = params;
    // Generate search conditions for each field
    const searchConditions = searchFields.flatMap((field) => {
        var _a;
        return (_a = searchTerms === null || searchTerms === void 0 ? void 0 : searchTerms.map((term) => ({
            [field]: {
                contains: term,
                mode: "insensitive", // Case-insensitive search
            },
        }))) !== null && _a !== void 0 ? _a : [];
    } // Ensure the result is never undefined
    );
    const result = yield prisma_1.default.product.findMany({
        where: {
            isDeleted: false,
            AND: (searchTerms === null || searchTerms === void 0 ? void 0 : searchTerms.length) ? { OR: searchConditions.filter(Boolean) } : [],
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
});
const createProductIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("images", images);
    const { itemImages } = images;
    payload.images = itemImages.map((image) => image.path);
    const result = yield prisma_1.default.product.create({
        data: payload,
    });
    return result;
});
// get all vendor shop products
const getVendorShopProductsFromDB = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findUniqueOrThrow({
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
});
// get single  product from db
const getSingleProductFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
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
});
const updateVendorProductIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.update({
        where: {
            id,
            isDeleted: false,
        },
        data: payload,
    });
    return result;
});
const deleteVendorProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.update({
        where: {
            id,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.ProductService = {
    getAllProductsFromDB,
    getSingleProductFromDB,
    createProductIntoDB,
    getVendorShopProductsFromDB,
    updateVendorProductIntoDB,
    deleteVendorProductFromDB,
};

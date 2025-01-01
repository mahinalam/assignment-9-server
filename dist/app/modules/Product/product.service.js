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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const product_constant_1 = require("./product.constant");
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
const getAllProductsFromDB = (fieldParams, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const { searchTerm } = fieldParams, filterData = __rest(fieldParams, ["searchTerm"]);
    const andCondition = [];
    // search params
    if (fieldParams.searchTerm) {
        andCondition.push({
            OR: product_constant_1.productSearchAbleFields.map((field) => ({
                [field]: {
                    contains: fieldParams.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // specific field
    if (((_a = Object.keys(filterData)) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereCondition = { AND: andCondition };
    const result = yield prisma_1.default.product.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
    });
    const total = yield prisma_1.default.product.count({
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

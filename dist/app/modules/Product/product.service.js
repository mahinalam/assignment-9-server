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
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const product_constant_1 = require("./product.constant");
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
const getAllProductsFromDB = (fieldParams, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const { searchTerm, priceMin, priceMax, rating, brandId, categoryId } = fieldParams;
    const andCondition = [];
    // Search functionality
    if (searchTerm) {
        andCondition.push({
            OR: product_constant_1.productSearchAbleFields.map((field) => ({
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
    const whereCondition = {
        AND: andCondition,
    };
    // Query database
    const result = yield prisma_1.default.product.findMany({
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

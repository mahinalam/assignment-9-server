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
// get all featured products
const getAllFeaturedProductsFromDB = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.product.findMany({
        where: {
            isDeleted: false,
            isFeatured: true,
        },
        select: {
            id: true,
            name: true,
            category: {
                select: {
                    name: true,
                },
            },
            shop: {
                select: {
                    name: true,
                },
            },
            price: true,
            stock: true,
            images: true,
            discount: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.product.count({
        where: { isDeleted: false, isFeatured: true },
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
// get all flash products
const getAllFlashProductsFromDB = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const result = yield prisma_1.default.product.findMany({
        where: {
            isDeleted: false,
            isFlashed: true,
        },
        select: {
            id: true,
            name: true,
            category: {
                select: {
                    name: true,
                },
            },
            shop: {
                select: {
                    name: true,
                },
            },
            review: {
                select: {
                    comment: true,
                    createdAt: true,
                },
            },
            price: true,
            stock: true,
            images: true,
            discount: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
    });
    const total = yield prisma_1.default.product.count({
        where: { isDeleted: false, isFlashed: true },
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
const getAllProductsFromDB = (fieldParams, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const { searchTerm, priceMin, priceMax, rating, categoryId, stock } = fieldParams;
    console.log("category", categoryId);
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
                priceMin ? { price: { gte: parseInt(priceMin, 10) } } : {},
                priceMax ? { price: { lte: parseInt(priceMax, 10) } } : {},
            ],
        });
    }
    if (stock === "all" || "in_stock") {
        andCondition.push({
            stock: {
                gt: 0,
            },
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
    // 📦 Category filter
    if (categoryId && categoryId === "all") {
        andCondition.push({});
    }
    else {
        andCondition.push({ categoryId });
    }
    // Combine all conditions
    const whereCondition = {
        AND: andCondition,
        isDeleted: false,
        isFeatured: false,
        isFlashed: false,
    };
    // Query database
    const result = yield prisma_1.default.product.findMany({
        where: whereCondition,
        include: {
            review: true,
            category: true,
            shop: true,
        },
        skip: skip,
        take: limit,
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
// create product
const createProductIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    // check is shop exits
    yield prisma_1.default.shop.findFirstOrThrow({
        where: {
            id: payload.shopId,
            isDeleted: false,
        },
    });
    // check is category exists
    yield prisma_1.default.category.findFirstOrThrow({
        where: {
            id: payload.categoryId,
            isDeleted: false,
        },
    });
    const productData = Object.assign(Object.assign({}, payload), { price: Number(payload.price), stock: Number(payload.stock), discount: (payload === null || payload === void 0 ? void 0 : payload.discount) ? Number(payload.discount) : 0 });
    const { itemImages } = images;
    console.log("items images", itemImages);
    if (images) {
        const newImagePaths = itemImages.map((image) => image.path);
        productData.images = newImagePaths;
    }
    const result = yield prisma_1.default.product.create({
        data: productData,
    });
    return result;
});
// update product
const updateProductIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if product exists
    yield prisma_1.default.product.findFirstOrThrow({
        where: {
            id: payload.id,
            isDeleted: false,
        },
    });
    // Check if category exists
    yield prisma_1.default.category.findFirstOrThrow({
        where: {
            id: payload.categoryId,
            isDeleted: false,
        },
    });
    const updatedProductData = Object.assign({}, payload);
    // 🔁 Convert number-like fields safely
    if (payload.price) {
        console.log("hi");
        updatedProductData.price = Number(payload.price);
    }
    if (payload.stock) {
        updatedProductData.stock = Number(payload.stock);
    }
    if (payload.discount) {
        updatedProductData.discount = Number(payload.discount);
    }
    const productImages = images === null || images === void 0 ? void 0 : images.itemImages;
    // If new images are provided, replace the old ones
    if (productImages && Object.keys(productImages).length > 0) {
        const newImagePaths = productImages.map((image) => image.path);
        updatedProductData.images = newImagePaths;
    }
    else {
        // Don't update the images field if no new images are provided
        delete updatedProductData.images;
    }
    const result = yield prisma_1.default.product.update({
        where: {
            id: payload.id,
        },
        data: updatedProductData,
    });
    return result;
});
// get all vendor shop products
const getVendorShopProductsFromDB = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findFirst({
        where: {
            id: shopId,
            isDeleted: false,
        },
        include: {
            product: true,
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
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return result;
});
// const updateProductStatusIntoDB = async (payload: {
//   id: string;
//   status: any;
// }) => {
//   // check is shop exits
//   await prisma.product.findUniqueOrThrow({
//     where: {
//       id: payload.id,
//     },
//   });
//   const updatedData: Record<string, unknown> = {};
//   if (payload.status === "flash") {
//     updatedData.isFlashed = true;
//   }
//   if (payload.status === "featured") {
//     updatedData.isFeatured = true;
//   }
//   // update product status
//   const result = await prisma.product.update({
//     where: {
//       id: payload.id,
//       isDeleted: false,
//     },
//     data: updatedData,
//   });
//   return result;
// };
const updateProductStatusIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("id", payload.id);
    console.log("status", payload.status);
    // Check if product exists and is not deleted
    yield prisma_1.default.product.findFirstOrThrow({
        where: {
            id: payload.id,
            isDeleted: false,
        },
    });
    // Build update object
    const dataToUpdate = {};
    if ((_a = payload === null || payload === void 0 ? void 0 : payload.status) === null || _a === void 0 ? void 0 : _a.isFlashed) {
        dataToUpdate.isFlashed = true;
    }
    else {
        dataToUpdate.isFlashed = false;
    }
    if ((_b = payload === null || payload === void 0 ? void 0 : payload.status) === null || _b === void 0 ? void 0 : _b.isFeatured) {
        dataToUpdate.isFeatured = true;
    }
    else {
        dataToUpdate.isFeatured = false;
    }
    // Update product
    const result = yield prisma_1.default.product.update({
        where: {
            id: payload.id,
        },
        data: dataToUpdate,
    });
    return result;
});
// const updateVendorProductIntoDB = async (
//   id: string,
//   payload: Partial<Product>
// ) => {
//   console.log(id);
//   const result = await prisma.product.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: payload,
//   });
//   return result;
// };
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
    updateProductIntoDB,
    deleteVendorProductFromDB,
    getAllFeaturedProductsFromDB,
    getAllFlashProductsFromDB,
    updateProductStatusIntoDB,
};

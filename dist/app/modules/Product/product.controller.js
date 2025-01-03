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
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const product_service_1 = require("./product.service");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const pick_1 = __importDefault(require("../../../sharred/pick"));
const product_constant_1 = require("./product.constant");
// const getAllProducts = catchAsync(async (req, res) => {
//   const { searchTerms, sortBy, sortOrder, searchFields } = req.query;
//   const parsedSearchTerms = Array.isArray(searchTerms)
//     ? searchTerms.map(String) // Convert each term to a string
//     : searchTerms
//     ? [String(searchTerms)] // If there's a single term, convert it to an array
//     : [];
//   const parsedSortBy = (sortBy as "name" | "newPrice") || "name"; // Default to 'name' if not provided
//   const parsedSortOrder = (sortOrder as "asc" | "desc") || "asc"; // Default to 'asc' if not provided
//   const products = await ProductService.getAllProductsFromDB({
//     searchTerms: parsedSearchTerms,
//     sortBy: parsedSortBy,
//     sortOrder: parsedSortOrder,
//   });
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "All products retrieved successfully",
//     data: products,
//   });
// });
// const getAllProducts = catchAsync(async (req, res) => {
//   const {
//     searchTerms,
//     sortBy,
//     sortOrder,
//     priceMax,
//     priceMin,
//     rating,
//     brand,
//     page,
//     limit,
//     category,
//   } = req.query;
//   // Parse `searchTerms` as a comma-separated string
//   const parsedSearchTerms = searchTerms
//     ? String(searchTerms)
//         .split(",")
//         .map((term) => term.trim()) // Split by comma and trim whitespace
//     : [];
//   const parsedSortBy = (sortBy as "name" | "newPrice") || "name"; // Default to 'name' if not provided
//   const parsedSortOrder = (sortOrder as "asc" | "desc") || "asc"; // Default to 'asc' if not provided
//   console.log("price max", Number(priceMax));
//   const products = await ProductService.getAllProductsFromDB({
//     searchTerms: parsedSearchTerms,
//     sortBy: parsedSortBy,
//     sortOrder: parsedSortOrder,
//     brand: brand as string,
//     rating: Number(rating),
//     priceRange: { min: Number(priceMin), max: Number(priceMax) },
//     page: page ? Number(page) : 1,
//     limit: limit ? Number(limit) : 10,
//     category: category as string,
//     // Add priceMin, priceMax, and rating filters here if needed
//   });
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "All products retrieved successfully",
//     data: products,
//   });
// });
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //pick
    const filterFields = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    // pagination pick
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield product_service_1.ProductService.getAllProductsFromDB(filterFields, paginationOption);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Products retrieval successfully",
        // meta: result.meta,
        data: result,
    });
}));
const getSingleProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_service_1.ProductService.getSingleProductFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Product retrieved successfully",
        data: product,
    });
}));
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("files", req.files);
    console.log("body", req.body);
    if (!req.files) {
        throw new ApiError_1.default(400, "Please upload an image");
    }
    const result = yield product_service_1.ProductService.createProductIntoDB(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product Added successfuly!",
        data: result,
    });
}));
const getAllVendorProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const products = yield product_service_1.ProductService.getVendorShopProductsFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Vendor's products retrieved successfully",
        data: products,
    });
}));
const updateVendorShopProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.ProductService.updateVendorProductIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product Updated successfuly!",
        data: result,
    });
}));
const deleteVendorShopProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.ProductService.deleteVendorProductFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product deleted successfuly!",
        data: result,
    });
}));
exports.ProductController = {
    getAllProducts,
    getSingleProductFromDB,
    createProduct,
    getAllVendorProducts,
    updateVendorShopProduct,
    deleteVendorShopProduct,
};

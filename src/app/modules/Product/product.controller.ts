import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import { ProductService } from "./product.service";
import ApiError from "../../errors/ApiError";
import { TImageFiles } from "../../interfaces/file";
import pick from "../../../sharred/pick";
import {
  productFilterableFields,
  productSearchAbleFields,
} from "./product.constant";

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

const getAllProducts = catchAsync(async (req, res) => {
  //pick
  const filterFields = pick(req.query, productFilterableFields);
  // pagination pick
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await ProductService.getAllProductsFromDB(
    filterFields,
    paginationOption
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieval successfully",
    // meta: result.meta,
    data: result,
  });
});

const getSingleProductFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await ProductService.getSingleProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product retrieved successfully",
    data: product,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  console.log("files", req.files);
  console.log("body", req.body);

  if (!req.files) {
    throw new ApiError(400, "Please upload an image");
  }
  const result = await ProductService.createProductIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product Added successfuly!",
    data: result,
  });
});

const getAllVendorProducts = catchAsync(async (req, res) => {
  const { id } = req.params;

  const products = await ProductService.getVendorShopProductsFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor's products retrieved successfully",
    data: products,
  });
});

const updateVendorShopProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ProductService.updateVendorProductIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product Updated successfuly!",
      data: result,
    });
  }
);

const deleteVendorShopProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ProductService.deleteVendorProductFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product deleted successfuly!",
      data: result,
    });
  }
);

export const ProductController = {
  getAllProducts,
  getSingleProductFromDB,
  createProduct,
  getAllVendorProducts,
  updateVendorShopProduct,
  deleteVendorShopProduct,
};

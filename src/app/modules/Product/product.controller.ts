import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { ProductService } from "./product.service";
import ApiError from "../../errors/ApiError";
import { TImageFiles } from "../../interfaces/file";
import pick from "../../../sharred/pick";
import { productFilterableFields } from "./product.constant";

const getAllProducts = catchAsync(async (req, res) => {
  console.log("authorization", req.headers.authorization);
  //pick
  const filterFields = pick(req.query, productFilterableFields);
  console.log({ filterFields });
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

// const getAllProducts = catchAsync(async (req, res) => {
//   const {
//     rating,
//     brandId,
//     categoryId,
//     priceMin,
//     priceMax,
//     searchTerm,
//     sortOrder,
//     page,
//     limit,
//   } = req.query;

//   const result = await ProductService.getAllProductsFromDB(
//     Number(rating),
//     brandId,
//     categoryId,
//     Number(priceMin),
//     Number(priceMax),
//     searchTerm,
//     sortOrder,
//     Number(page),
//     Number(limit)
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Products retrieval successfully",
//     // meta: result.meta,
//     data: result,
//   });
// });

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

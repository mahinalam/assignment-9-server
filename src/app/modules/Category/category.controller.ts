import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import { CategoryService } from "./category.service";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import pick from "../../../sharred/pick";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an image");
  }
  const result = await CategoryService.createCategoryIntoDB(
    req.body,
    req.file as TImageFile
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category Created successfuly!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const categories = await CategoryService.getAllCategoriesFromDB(
    paginationOption
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await CategoryService.getSingleCategory(categoryId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category retrieved successfully",
    data: category,
  });
});

// delete category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CategoryService.deleteCategoryFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfuly!",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
};

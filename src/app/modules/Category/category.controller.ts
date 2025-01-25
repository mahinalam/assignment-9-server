import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import { CategoryService } from "./category.service";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category Created successfuly!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await CategoryService.getAllCategoriesFromDB();

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

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
};

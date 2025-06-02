import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import pick from "../../../sharred/pick";
import { CompareService } from "./compare.service";

const getUsersCompare = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const compareProducts = await CompareService.getUsersCompareProduct(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Compare products retrieved successfully",
    data: compareProducts,
  });
});

const createCompare = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.body;
  const { userId } = req.user;
  const result = await CompareService.createCompareIntoDB(userId, productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Compare Created successfuly!",
    data: result,
  });
});

// delete category
const deleteCompare = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;
  const result = await CompareService.removeCompareProduct(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Compare Item deleted successfuly!",
    data: result,
  });
});

export const CompareController = {
  createCompare,
  getUsersCompare,
  deleteCompare,
};

import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { BrandService } from "./brand.service";

const createBarnd = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrandIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brand Created successfuly!",
    data: result,
  });
});

const getAllBarnd = catchAsync(async (req, res) => {
  const categories = await BrandService.getAllBrandFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Brands retrieved successfully",
    data: categories,
  });
});

export const BrandController = {
  createBarnd,
  getAllBarnd,
  //   createCustomer,
  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};

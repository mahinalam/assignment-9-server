import { Request, RequestHandler, Response } from "express";
// import { userService } from "./user.sevice";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import httpStatus from "http-status";
// import pick from "../../../shared/pick";
// import { userFilterableFields } from "./user.constant";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import { ShopService } from "./shop.service";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
// import { CategoryService } from "./category.service";

const createShop = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an image");
  }
  const result = await ShopService.createShopIntoDB(
    req.body,
    req.file as TImageFile
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shop Created successfuly!",
    data: result,
  });
});

const getVendorShop = catchAsync(async (req, res) => {
  console.log(req.user);

  const result = await ShopService.getVendorShop(req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor Shop retrieved successfully.",
    data: result,
  });
});

const getAllShop = catchAsync(async (req, res) => {
  const result = await ShopService.getAllShop();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop retrieved successfully.",
    data: result,
  });
});

export const ShopController = {
  createShop,
  getVendorShop,
  getAllShop,
  //   createCustomer,
  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};

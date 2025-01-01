import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { FollowingShopService } from "./followingShop.service";

const followShop = catchAsync(async (req: Request, res: Response) => {
  const result = await FollowingShopService.followShop(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully Followed Shop!",
    data: result,
  });
});

// const getAllCategories = catchAsync(async (req, res) => {
//   const categories = await CategoryService.getAllCategoriesFromDB();

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Categories retrieved successfully",
//     data: categories,
//   });
// });

export const FollowingShopController = {
  followShop,
  //   getAllCategories,
  //   createCustomer,
  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};

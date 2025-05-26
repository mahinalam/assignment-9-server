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
import pick from "../../../sharred/pick";
// import { CategoryService } from "./category.service";

const createShop = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  if (!req.file) {
    throw new ApiError(400, "Please upload an image");
  }
  const result = await ShopService.createShopIntoDB(
    userId,
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
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await ShopService.getVendorShop(paginationOption, req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor Shop retrieved successfully.",
    data: result,
  });
});

const getAllShop = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await ShopService.getAllShop(paginationOption);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop retrieved successfully.",
    data: result,
  });
});

const followShop = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params;
  const result = await ShopService.followShop(userId, req.body.shopId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully Followed Shop!",
    data: result,
  });
});

const getUsersFollowingShop = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await ShopService.getAllFollowingShops(
    userId,
    paginationOption
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: " Following shops retrieved successfully.",
    data: result,
  });
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await ShopService.updateShopIntoDB(
    userId,
    req.body,
    req.file as TImageFile
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shop updated successfuly!",
    data: result,
  });
});

const blockShop = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ShopService.blockShopIntoDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Shop blocked successfully!",
    data: result,
  });
});

const unfollowShop = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await ShopService.unFollowShopIntoDB(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully unfollowed the shop!",
    data: result,
  });
});
// check is following shop
const getIsFollowingShop = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await ShopService.getIsFollowingShop(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sucessfully chcek follower",
    data: result,
  });
});

export const ShopController = {
  createShop,
  getVendorShop,
  getAllShop,
  followShop,
  blockShop,
  updateShop,
  getUsersFollowingShop,
  unfollowShop,
  getIsFollowingShop,
};

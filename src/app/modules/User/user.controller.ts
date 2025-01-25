import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { UserService } from "./user.service";
import { TImageFile } from "../../interfaces/file";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: result,
  });
});

const getAdminStats = catchAsync(async (req, res) => {
  const result = await UserService.getAdminStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin stats successfully",
    data: result,
  });
});

const getVendorStats = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await UserService.getVendorStats(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor stats successfully",
    data: result,
  });
});

const getUserStats = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await UserService.getUserStats(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User stats successfully",
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Created successfuly!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMyProfile(
    req.body,
    req.file as TImageFile
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile Updated successfuly!",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  createUser,
  getSingleUser,
  updateMyProfile,
  getAdminStats,
  getVendorStats,
  getUserStats,
};

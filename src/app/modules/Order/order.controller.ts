import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order Created successfuly!",
    data: result,
  });
});

const getVendorOrderHistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const orders = await OrderService.getVendorOrderHistory(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order History retrieved successfully",
    data: orders,
  });
});

const getUsersOrderHistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const orders = await OrderService.getUsersOrderHistory(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order History retrieved successfully",
    data: orders,
  });
});

export const OrderController = {
  createOrder,
  getVendorOrderHistory,
  getUsersOrderHistory,
  //   getAllCategories,
  //   createCustomer,
  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};

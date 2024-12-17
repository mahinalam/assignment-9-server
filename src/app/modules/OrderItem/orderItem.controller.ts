import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { OrderItemService } from "./orderItem.service";

const createOrderItem = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderItemService.createOrderItemIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order Item created successfuly!",
    data: result,
  });
});

const getAllOrderItem = catchAsync(async (req, res) => {
  const orderItems = await OrderItemService.getOrderItemsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order Items retrieved successfully",
    data: orderItems,
  });
});

export const OrderItemController = {
  createOrderItem,
  getAllOrderItem,
  //   getAllCategories,
  //   createCustomer,
  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};

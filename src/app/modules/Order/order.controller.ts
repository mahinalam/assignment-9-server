import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { OrderService } from "./order.service";
import pick from "../../../sharred/pick";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  console.log("order", req.body);
  const result = await OrderService.createOrderIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order Created successfuly!",
    data: result,
  });
});

const getVendorOrderHistory = catchAsync(async (req, res) => {
  const { email } = req.user;
  const orders = await OrderService.getVendorOrderHistory(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor Order History retrieved successfully",
    data: orders,
  });
});

const getUsersOrderHistory = catchAsync(async (req, res) => {
  const { email } = req.user;
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const orders = await OrderService.getUsersOrderHistory(
    email,
    paginationOption
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Order History retrieved successfully",
    data: orders,
  });
});

const getAllOrderHistory = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const orders = await OrderService.getAllOrderHistory(paginationOption);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order History retrieved successfully",
    data: orders,
  });
});

const getUserUnconfirmOrder = catchAsync(async (req, res) => {
  const { email } = req.user;
  const orders = await OrderService.getUserUnConfirmOrder(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order retrieved successfully",
    data: orders,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const orders = await OrderService.updateOrder(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order updated successfully",
    data: orders,
  });
});

export const OrderController = {
  createOrder,
  getVendorOrderHistory,
  getUsersOrderHistory,
  getAllOrderHistory,
  getUserUnconfirmOrder,
  updateOrderStatus,
};

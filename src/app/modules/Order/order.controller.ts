import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
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
  const { userId } = req.user;
  const orders = await OrderService.getVendorOrderHistory(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor Order History retrieved successfully",
    data: orders,
  });
});

const getUsersOrderHistory = catchAsync(async (req, res) => {
  const { email } = req.user;
  const orders = await OrderService.getUsersOrderHistory(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Order History retrieved successfully",
    data: orders,
  });
});

const getAllOrderHistory = catchAsync(async (req, res) => {
  const orders = await OrderService.getAllOrderHistory();

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

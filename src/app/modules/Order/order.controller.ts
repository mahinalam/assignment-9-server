import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { OrderService } from "./order.service";
import pick from "../../../sharred/pick";

// create order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await OrderService.createOrderIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order Created successfuly!",
    data: result,
  });
});

// vendor order history
const getVendorOrderHistory = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const { email } = req.user;
  const orders = await OrderService.getVendorOrderHistory(
    paginationOption,
    email
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vendor Order History retrieved successfully",
    data: orders,
  });
});

// users order history
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

// all orders
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

// users unconfirm order
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

// delete order
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.user;
  const result = await OrderService.deleteOrderFromDB(email, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order deleted successfuly!",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getVendorOrderHistory,
  getUsersOrderHistory,
  getAllOrderHistory,
  getUserUnconfirmOrder,
  deleteOrder,
};

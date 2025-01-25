import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { CartService } from "./cart.service";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await CartService.addToCart(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart Created successfuly!",
    data: result,
  });
});

const removeCart = catchAsync(async (req, res) => {
  const { cartItemId } = req.body;
  const orders = await CartService.removeCartItem(cartItemId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Item removed successfully",
    data: orders,
  });
});

const clearCart = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const orders = await CartService.clearCart(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Cart clear successfully",
    data: orders,
  });
});

const userCart = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const orders = await CartService.getUserCart(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User cart retrieved successfully.",
    data: orders,
  });
});

export const CartController = {
  addToCart,
  removeCart,
  clearCart,
  userCart,
};

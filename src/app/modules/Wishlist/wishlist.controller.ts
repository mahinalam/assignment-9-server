import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";

import pick from "../../../sharred/pick";
import { WishListService } from "./wishlist.service";

const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  console.log("user id", userId);

  const result = await WishListService.createWishlistIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wishlist Created successfuly!",
    data: result,
  });
});

const getUsersWishlists = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const { userId } = req.user;
  const wishlists = await WishListService.getUsersWishlistsFromDB(
    paginationOption,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users wishlists retrieved successfully",
    data: wishlists,
  });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await WishListService.removeFromWishlistFromDB(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wishlists product removed successfuly!",
    data: result,
  });
});

export const WishlistController = {
  createWishlist,
  getUsersWishlists,
  removeFromWishlist,
};

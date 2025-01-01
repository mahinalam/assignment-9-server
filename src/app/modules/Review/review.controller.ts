import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile, TImageFiles } from "../../interfaces/file";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReviewIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review Added successfuly!",
    data: result,
  });
});

const getProductSpecificReviews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reviews = await ReviewService.getProductSpecificReviews(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

const getVendorProductsReviews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reviews = await ReviewService.getAllVendorProductsReviews(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});
const getUserProductReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reviews = await ReviewService.getUserProductReview(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

export const ReviewController = {
  createReview,
  getProductSpecificReviews,
  getVendorProductsReviews,
  getUserProductReview,
  //   createCustomer,
  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};

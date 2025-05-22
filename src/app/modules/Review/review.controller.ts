import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { TImageFiles } from "../../interfaces/file";
import { ReviewService } from "./review.service";
import pick from "../../../sharred/pick";
import { reviewFilterableFields } from "./review.constant";

// get all reviews
const getAllReviews = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const reviews = await ReviewService.getAllReviewsFromDB(paginationOption);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All Reviews retrieved successfully",
    data: reviews,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await ReviewService.createReviewIntoDB(
    userId,
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
  console.log("authorization", req.headers.authorization);
  //pick
  const filterFields = pick(req.query, reviewFilterableFields);
  console.log("filter fields", filterFields);

  // pagination pick
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await ReviewService.getProductSpecificReviews(
    filterFields,
    paginationOption
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieval successfully",
    // meta: result.meta,
    data: result,
  });
});

const getVendorProductsReviews = catchAsync(async (req, res) => {
  const paginationOption = pick(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const { email } = req.user;
  const reviews = await ReviewService.getAllVendorProductsReviews(
    paginationOption,
    email
  );

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

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ReviewService.deleteReviewFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfuly!",
    data: result,
  });
});

export const ReviewController = {
  getAllReviews,
  createReview,
  getProductSpecificReviews,
  getVendorProductsReviews,
  getUserProductReview,
  deleteReview,
};

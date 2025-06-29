"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const review_service_1 = require("./review.service");
const pick_1 = __importDefault(require("../../../sharred/pick"));
const review_constant_1 = require("./review.constant");
// get all reviews
const getAllReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const reviews = yield review_service_1.ReviewService.getAllReviewsFromDB(paginationOption);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All Reviews retrieved successfully",
        data: reviews,
    });
}));
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield review_service_1.ReviewService.createReviewIntoDB(userId, req.body, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review Added successfuly!",
        data: result,
    });
}));
const createPublicReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewService.createPublicReviewIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews Added successfuly!",
        data: result,
    });
}));
const getProductSpecificReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("authorization", req.headers.authorization);
    //pick
    const filterFields = (0, pick_1.default)(req.query, review_constant_1.reviewFilterableFields);
    console.log("filter fields", filterFields);
    // pagination pick
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield review_service_1.ReviewService.getProductSpecificReviews(filterFields, paginationOption);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Products retrieval successfully",
        // meta: result.meta,
        data: result,
    });
}));
const getVendorProductsReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const { email } = req.user;
    const reviews = yield review_service_1.ReviewService.getAllVendorProductsReviews(paginationOption, email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: reviews,
    });
}));
const getUserProductReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const { userId } = req.user;
    const reviews = yield review_service_1.ReviewService.getUserProductReview(userId, paginationOption);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Users reviews retrieved successfully",
        data: reviews,
    });
}));
const deleteUserReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_service_1.ReviewService.deleteUserReviewFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review deleted successfuly!",
        data: result,
    });
}));
exports.ReviewController = {
    getAllReviews,
    createReview,
    getProductSpecificReviews,
    getVendorProductsReviews,
    getUserProductReview,
    deleteUserReview,
    createPublicReview,
};

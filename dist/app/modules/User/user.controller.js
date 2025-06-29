"use strict";
// import { Request, Response } from "express";
// import catchAsync from "../../../sharred/catchAsync";
// import sendResponse from "../../../sharred/sendResponse";
// import { UserService } from "./user.service";
// import { TImageFile } from "../../interfaces/file";
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
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const user_service_1 = require("./user.service");
const pick_1 = __importDefault(require("../../../sharred/pick"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield user_service_1.UserService.getAllUsersFromDB(paginationOption);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield user_service_1.UserService.getSingleUserFromDB(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User retrieved successfully",
        data: result,
    });
}));
// create customer
const createCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, customer } = req.body;
    const result = yield user_service_1.UserService.createCustomerIntoDB(user, customer);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Customer Created successfuly!",
        data: result,
    });
}));
// create vendor
const createVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, vendor, shop } = req.body;
    const shopImage = req.file;
    if (!shopImage) {
        throw new ApiError_1.default(400, "Please upload a shop image.");
    }
    const result = yield user_service_1.UserService.createVendorIntoDB(user, vendor, shop, shopImage);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Vendor Created successfuly!",
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateMyProfile(req.user, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Profile Updated successfuly!",
        data: result,
    });
}));
const getVendorStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield user_service_1.UserService.getVendorStats(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Vendor stats retrived successfully",
        data: result,
    });
}));
const getUserStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield user_service_1.UserService.getUserStats(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User stats retrieved successfully",
        data: result,
    });
}));
const getAdminStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAdminStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Admin stats retrived successfully",
        data: result,
    });
}));
// delete user
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfuly!",
        data: result,
    });
}));
exports.UserController = {
    getAllUsers,
    createCustomer,
    createVendor,
    getSingleUser,
    updateMyProfile,
    getVendorStats,
    deleteUser,
    getUserStats,
    getAdminStats,
};

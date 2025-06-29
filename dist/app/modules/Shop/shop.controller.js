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
exports.ShopController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const shop_service_1 = require("./shop.service");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const pick_1 = __importDefault(require("../../../sharred/pick"));
// import { CategoryService } from "./category.service";
const createShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    if (!req.file) {
        throw new ApiError_1.default(400, "Please upload an image");
    }
    const result = yield shop_service_1.ShopService.createShopIntoDB(userId, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shop Created successfuly!",
        data: result,
    });
}));
const getVendorShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield shop_service_1.ShopService.getVendorShop(paginationOption, req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Vendor Shop retrieved successfully.",
        data: result,
    });
}));
const getAllShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield shop_service_1.ShopService.getAllShop(paginationOption);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop retrieved successfully.",
        data: result,
    });
}));
const followShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield shop_service_1.ShopService.followShop(userId, req.body.shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Successfully Followed Shop!",
        data: result,
    });
}));
const getUsersFollowingShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield shop_service_1.ShopService.getAllFollowingShops(userId, paginationOption);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: " Following shops retrieved successfully.",
        data: result,
    });
}));
const updateShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield shop_service_1.ShopService.updateShopIntoDB(userId, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shop updated successfuly!",
        data: result,
    });
}));
const blockShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield shop_service_1.ShopService.blockShopIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shop blocked successfully!",
        data: result,
    });
}));
const unfollowShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const result = yield shop_service_1.ShopService.unFollowShopIntoDB(userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Successfully unfollowed the shop!",
        data: result,
    });
}));
// check is following shop
const getIsFollowingShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const result = yield shop_service_1.ShopService.getIsFollowingShop(userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Sucessfully chcek follower",
        data: result,
    });
}));
exports.ShopController = {
    createShop,
    getVendorShop,
    getAllShop,
    followShop,
    blockShop,
    updateShop,
    getUsersFollowingShop,
    unfollowShop,
    getIsFollowingShop,
};

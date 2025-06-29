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
exports.WishlistController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const pick_1 = __importDefault(require("../../../sharred/pick"));
const wishlist_service_1 = require("./wishlist.service");
const createWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    console.log("user id", userId);
    const result = yield wishlist_service_1.WishListService.createWishlistIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Wishlist Created successfuly!",
        data: result,
    });
}));
const getUsersWishlists = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOption = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const { userId } = req.user;
    const wishlists = yield wishlist_service_1.WishListService.getUsersWishlistsFromDB(paginationOption, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Users wishlists retrieved successfully",
        data: wishlists,
    });
}));
const removeFromWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield wishlist_service_1.WishListService.removeFromWishlistFromDB(userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Wishlists product removed successfuly!",
        data: result,
    });
}));
exports.WishlistController = {
    createWishlist,
    getUsersWishlists,
    removeFromWishlist,
};

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
exports.CartController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const cart_service_1 = require("./cart.service");
const addToCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield cart_service_1.CartService.addToCart(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cart Created successfuly!",
        data: result,
    });
}));
const removeCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItemId } = req.body;
    const orders = yield cart_service_1.CartService.removeCartItem(cartItemId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Item removed successfully",
        data: orders,
    });
}));
const clearCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const orders = yield cart_service_1.CartService.clearCart(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Cart clear successfully",
        data: orders,
    });
}));
const userCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const orders = yield cart_service_1.CartService.getUserCart((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId);
    console.log("user id", (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User cart retrieved successfully.",
        data: orders,
    });
}));
exports.CartController = {
    addToCart,
    removeCart,
    clearCart,
    userCart,
};

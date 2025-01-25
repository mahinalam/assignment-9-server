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
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const order_service_1 = require("./order.service");
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.createOrderIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order Created successfuly!",
        data: result,
    });
}));
const getVendorOrderHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const orders = yield order_service_1.OrderService.getVendorOrderHistory(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Vendor Order History retrieved successfully",
        data: orders,
    });
}));
const getUsersOrderHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const orders = yield order_service_1.OrderService.getUsersOrderHistory(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User Order History retrieved successfully",
        data: orders,
    });
}));
const getAllOrderHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_service_1.OrderService.getAllOrderHistory();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Order History retrieved successfully",
        data: orders,
    });
}));
const getUserUnconfirmOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const orders = yield order_service_1.OrderService.getUserUnConfirmOrder(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Order retrieved successfully",
        data: orders,
    });
}));
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const orders = yield order_service_1.OrderService.updateOrder(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Order updated successfully",
        data: orders,
    });
}));
exports.OrderController = {
    createOrder,
    getVendorOrderHistory,
    getUsersOrderHistory,
    getAllOrderHistory,
    getUserUnconfirmOrder,
    updateOrderStatus,
};

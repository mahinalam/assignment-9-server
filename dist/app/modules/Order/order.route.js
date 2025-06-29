"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.OrderController.createOrder);
router.get("/vendor-order-history", (0, auth_1.default)(client_1.UserRole.VENDOR), order_controller_1.OrderController.getVendorOrderHistory);
router.get("/user-order-history", (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.OrderController.getUsersOrderHistory);
router.get("/order-history", (0, auth_1.default)(client_1.UserRole.ADMIN), order_controller_1.OrderController.getAllOrderHistory);
router.get("/unconfirm-order", (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.OrderController.getUserUnconfirmOrder);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.OrderController.deleteOrder);
exports.OrderRoute = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post("/", 
//   auth(UserRole.ADMIN),
order_controller_1.OrderController.createOrder);
router.get("/:id", 
// auth(UserRole.ADMIN),
order_controller_1.OrderController.getVendorOrderHistory);
router.get("/order-history/:id", 
// auth(UserRole.ADMIN),
order_controller_1.OrderController.getUsersOrderHistory);
exports.OrderRoute = router;

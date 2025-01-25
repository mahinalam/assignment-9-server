"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const cart_controller_1 = require("./cart.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.USER), cart_controller_1.CartController.addToCart);
router.post("/remove-cart", (0, auth_1.default)(client_1.UserRole.USER), cart_controller_1.CartController.removeCart);
router.get("/user-cart", (0, auth_1.default)(client_1.UserRole.USER), cart_controller_1.CartController.userCart);
router.post("/clear-cart", (0, auth_1.default)(client_1.UserRole.USER), cart_controller_1.CartController.clearCart);
exports.CartRoute = router;

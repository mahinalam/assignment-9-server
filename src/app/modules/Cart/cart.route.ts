import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = express.Router();

router.post("/", auth(UserRole.USER), CartController.addToCart);
router.post("/remove-cart", auth(UserRole.USER), CartController.removeCart);
router.get("/user-cart", auth(UserRole.USER), CartController.userCart);
router.post("/clear-cart", auth(UserRole.USER), CartController.clearCart);

export const CartRoute = router;

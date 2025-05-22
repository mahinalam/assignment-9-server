import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { CartController } from "./cart.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), CartController.addToCart);
router.post("/remove-cart", auth(UserRole.CUSTOMER), CartController.removeCart);
router.get("/user-cart", CartController.userCart);
router.post("/clear-cart", auth(UserRole.CUSTOMER), CartController.clearCart);

export const CartRoute = router;

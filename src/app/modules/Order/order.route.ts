import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post(
  "/",
  //   auth(UserRole.ADMIN),
  OrderController.createOrder
);

router.get(
  "/:id",
  // auth(UserRole.ADMIN),
  OrderController.getVendorOrderHistory
);

router.get(
  "/order-history/:id",
  // auth(UserRole.ADMIN),
  OrderController.getUsersOrderHistory
);

export const OrderRoute = router;

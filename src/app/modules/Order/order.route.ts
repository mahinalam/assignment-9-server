import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(UserRole.USER), OrderController.createOrder);

router.get(
  "/vendor-order-history",
  auth(UserRole.VENDOR),
  OrderController.getVendorOrderHistory
);

router.get(
  "/user-order-history",
  auth(UserRole.USER),
  OrderController.getUsersOrderHistory
);

router.get(
  "/order-history",
  auth(UserRole.ADMIN),
  OrderController.getAllOrderHistory
);
router.get(
  "/unconfirm-order",
  auth(UserRole.USER),
  OrderController.getUserUnconfirmOrder
);
router.put(
  "/update-order",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.ADMIN),
  OrderController.updateOrderStatus
);

export const OrderRoute = router;

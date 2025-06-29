import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), OrderController.createOrder);

router.get(
  "/vendor-order-history",
  auth(UserRole.VENDOR),
  OrderController.getVendorOrderHistory
);

router.get(
  "/user-order-history",
  auth(UserRole.CUSTOMER),
  OrderController.getUsersOrderHistory
);

router.get(
  "/order-history",
  auth(UserRole.ADMIN),
  OrderController.getAllOrderHistory
);
router.get(
  "/unconfirm-order",
  auth(UserRole.CUSTOMER),
  OrderController.getUserUnconfirmOrder
);
router.delete("/:id", auth(UserRole.CUSTOMER), OrderController.deleteOrder);

export const OrderRoute = router;

import { Router } from "express";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/confirmation", PaymentController.paymentConfirmationController);

export const PaymentRoute = router;

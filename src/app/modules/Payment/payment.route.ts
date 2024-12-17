import { Router } from "express";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";
// import { USER_ROLE } from "../User/user.constant";
// import { paymentControler } from './payment.controller';

const router = Router();

router.post("/confirmation", PaymentController.paymentConfirmationController);

export const PaymentRoute = router;

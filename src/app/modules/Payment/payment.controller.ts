import { Request, Response } from "express";
import { paymentServices } from "./payment.service";
import config from "../../../config";

const paymentConfirmationController = async (req: Request, res: Response) => {
  const successPayment = req.body;

  const isVerifiedSuccess = await paymentServices.confirmationService(
    successPayment
  );
  if (!isVerifiedSuccess) {
    return res.redirect(
      `${config.payment_cancel_url}/payment/success?token=${config.valid_success_token}`
    );
  }
  return res.redirect(
    `${config.payment_cancel_url}/payment/failed?token=${config.valid_failed_token}`
  );
};

export const PaymentController = {
  paymentConfirmationController,
};

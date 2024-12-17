import { Request, Response } from "express";
import { paymentServices } from "./payment.service";

const paymentConfirmationController = async (req: Request, res: Response) => {
  const { transactionId, status } = req.query;

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string
  );
  res.send(result);
};

export const PaymentController = {
  paymentConfirmationController,
};

/* eslint-disable no-unused-vars */
import { join } from "path";
// import orderModel from '../order/order.model';
import { verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import prisma from "../../../sharred/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message;

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    await prisma.$transaction(async (tx) => {
      // Step 2.1: Update order status
      const order = await tx.order.update({
        where: { transactionId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "COMPLETED", // Update totalPrice here if needed
        },
        include: { orderItem: true },
      });

      for (const item of order.orderItem) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    });

    message = "Successfully Paid!";
  } else {
    message = "Payment Failed!";
  }

  const filePath = join(__dirname, "../../../views/confirmation.html");
  let template = readFileSync(filePath, "utf-8");

  template = template.replace(`{{message}}`, message);

  return template;
};

// const getAllPaymentsFromDB = async () => {
//   const result = await Payment.find().populate("userId");
//   // .populate('category');
//   return result;
// };

export const paymentServices = {
  confirmationService,
  //   getAllPaymentsFromDB,
};

/* eslint-disable no-unused-vars */

import prisma from "../../../sharred/prisma";
import axios from "axios";
import config from "../../../config";

//   let message;

//   if (verifyResponse && verifyResponse.pay_status === "Successful") {
//     await prisma.$transaction(async (tx) => {
//       // Step 2.1: Update order status
//       const order = await tx.order.update({
//         where: { transactionId },
//         data: {
//           status: "CONFIRMED",
//           paymentStatus: "COMPLETED", // Update totalPrice here if needed
//         },
//         include: { orderItem: true },
//       });

//       for (const item of order.orderItem) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }
//     });

//     message = "Successfully Paid!";
//   } else {
//     message = "Payment Failed!";
//   }

//   const filePath = join(__dirname, "../../../views/confirmation.html");
//   let template = readFileSync(filePath, "utf-8");

//   template = template.replace(`{{message}}`, message);

//   return template;
// };

const confirmationService = async (paymentSuccess: any) => {
  // validation
  const { data } = await axios.get(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${paymentSuccess?.val_id}&store_id=${config.store_id}&store_passwd=${config.store_password}`
  );

  if (data?.status !== "VALID") {
    return false;
  }

  await prisma.$transaction(async (tx) => {
    // Step 2.1: Update order status
    const order = await tx.order.update({
      where: { transactionId: data?.tran_id },
      data: {
        status: "CONFIRMED",
        paymentStatus: "COMPLETED",
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

  return true;
};

export const paymentServices = {
  confirmationService,
};

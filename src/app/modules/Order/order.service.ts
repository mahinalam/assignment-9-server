import { Order } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { initiatePayment } from "../Payment/payment.utils";

const createOrderIntoDB = async (payload: any) => {
  const {
    customerShippingAddress,
    orderItems,
    shopId,
    customerName,
    customerEmail,
    customerPhone,
  } = payload;
  console.log("order items", orderItems);
  const totalPrice: number = orderItems?.reduce((total: number, item: any) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);
  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (prisma) => {
    // Create order
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const transactionId = `txn_${timestamp}_${randomStr}`;

    const orderInfo = await prisma.order.create({
      data: {
        totalPrice,
        customerShippingAddress,
        transactionId,
        shopId,
        customerName,
        customerEmail,
        customerPhone,
      },
    });

    // Create order items
    const allOrderItems = orderItems.map((item: any) => ({
      orderId: orderInfo.id,
      productId: item.productId,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    await prisma.orderItem.createMany({
      data: allOrderItems,
    });

    // const paymentData = {
    //   transactionId,
    //   totalPrice,
    //   customerName: orderInfo.customerName,
    //   customerEmail: orderInfo.customerEmail,
    //   customerPhone: orderInfo.customerPhone,
    //   customerAddress: orderInfo.customerShippingAddress,
    // };
    // // console.log("paymentData", paymentData);
    // const paymentSession = await initiatePayment(paymentData);
    // // console.log("paymentdata", paymentData);

    // return paymentSession;
  });
  return result;
};

const getVendorOrderHistory = async (vendorId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      shop: {
        ownerId: vendorId,
      },
    },
    include: {
      orderItems: true,
      shop: true,
    },
  });

  return orders;
};

const getAllOrderHistory = async () => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      orderItems: true,
      shop: true,
    },
  });

  return orders;
};

const getUsersOrderHistory = async (email: string) => {
  const orders = await prisma.order.findMany({
    where: {
      customerEmail: email,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  return orders;
};

const getUserUnConfirmOrder = async (email: string) => {
  const allCarts = await prisma.order.findFirst({
    where: {
      customerEmail: email,
      orderStatus: "PENDING",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return allCarts;
};

// const updateOrder = async (payload: {
//   transactionId: string;
//   totalPrice: number;
// }) => {
//   const { transactionId, totalPrice } = payload;

//   // chcek if the order exists
//   const idOrderExists = await prisma.order.findUniqueOrThrow({
//     where: {
//       transactionId,
//     },
//   });

//   if (idOrderExists.orderStatus !== "PENDING") {
//     throw new Error("Order status must be PENDING to confirm.");
//   }

//   // Step 2: Update order status and handle stock decrement in a transaction
//   await prisma.$transaction(async (tx) => {
//     // Update the order
//     const order = await tx.order.update({
//       where: { transactionId },
//       data: {
//         orderStatus: "CONFIRMED",
//         totalPrice,
//       },
//       include: { orderItems: true },
//     });

//     // Decrement product quantities
//     for (const item of order.orderItems) {
//       await tx.product.update({
//         where: { id: item.productId },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }

//     return order;
//   });

//   const paymentData = {
//     transactionId,
//     totalPrice,
//     customerName: idOrderExists.customerName,
//     customerEmail: idOrderExists.customerEmail,
//     customerPhone: idOrderExists.customerPhone,
//     customerAddress: idOrderExists.customerShippingAddress,
//   };
//   // console.log("paymentData", paymentData);
//   const paymentSession = await initiatePayment(paymentData);
//   // console.log("paymentdata", paymentData);

//   return paymentSession;

//   // return orders;
// };

const updateOrder = async (
  userId: string,
  payload: {
    transactionId: string;
    totalPrice: number;
  }
) => {
  const { transactionId, totalPrice } = payload;

  // Check if the order exists
  const idOrderExists = await prisma.order.findUniqueOrThrow({
    where: { transactionId },
  });

  if (idOrderExists.orderStatus !== "PENDING") {
    throw new Error("Order status must be PENDING to confirm.");
  }

  // Step 2: Update order status and handle stock decrement in a transaction
  await prisma.$transaction(async (tx) => {
    // Step 2.1: Update order status
    const order = await tx.order.update({
      where: { transactionId },
      data: {
        orderStatus: "CONFIRMED",
        totalPrice, // Update totalPrice here if needed
      },
      include: { orderItems: true },
    });

    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // step:2 find the cart

    const existingCart = await prisma.cart.findFirst({
      where: {
        customerId: userId,
      },
      include: {
        cartItems: true,
      },
    });
    for (const item of existingCart!.cartItems) {
      await tx.cartItem.deleteMany({
        where: { cartId: existingCart!.id },
      });
    }

    // Step 2.3: Clear the user's cart and cart items after confirming the order
    await tx.cart.delete({
      where: { id: existingCart!.id },
    });
  });

  console.log("Order confirmed and cart cleared for User ID:", userId);

  // Step 3: Initiate the payment session
  const paymentData = {
    transactionId,
    totalPrice,
    customerName: idOrderExists.customerName,
    customerEmail: idOrderExists.customerEmail,
    customerPhone: idOrderExists.customerPhone,
    customerAddress: idOrderExists.customerShippingAddress,
  };

  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

export const OrderService = {
  createOrderIntoDB,
  getVendorOrderHistory,
  getUsersOrderHistory,
  getAllOrderHistory,
  getUserUnConfirmOrder,
  updateOrder,
};

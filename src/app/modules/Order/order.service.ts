import { Category, Order, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { initiatePayment } from "../Payment/payment.utils";

const createOrderIntoDB = async (payload: any) => {
  const { userId, shippingAddress, orderItems, shopId } = payload;

  const totalPrice = orderItems.reduce((total: number, item: any) => {
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
        userId,
        totalPrice,
        shippingAddress,
        transactionId,
        shopId,
      },
      include: {
        user: true,
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

    const paymentData = {
      transactionId,
      totalPrice,
      customerName: orderInfo.user.name,
      customerEmail: orderInfo.user.email,
      customerPhone: orderInfo.user.phoneNumber,
      customerAddress: orderInfo.user.address,
    };
    // console.log("paymentData", paymentData);
    const paymentSession = await initiatePayment(paymentData);
    // console.log("paymentdata", paymentData);

    return paymentSession;
  });
  console.log("result", result);
  return result;
};

// const getAllCategoriesFromDB = async () => {
//   const result = await prisma.category.findMany();
//   return result;
// };

const getVendorOrderHistory = async (vendorId: string) => {
  console.log("vendor id", vendorId);
  // const orders = await prisma.order.findMany({
  //   where: {
  //     orderItems: {
  //       some: {
  //         product: {
  //           shop: {
  //             ownerId: vendorId,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   include: {
  //     orderItems: {
  //       include: {
  //         product: true, // Include product details
  //       },
  //     },
  //     user: true, // Include user who placed the order
  //     payment: true, // Include payment details
  //   },
  // });

  const orders = await prisma.order.findMany({
    where: {
      shop: {
        ownerId: vendorId,
      },
    },
    include: {
      orderItems: true,
      shop: true,
      user: true,
    },
  });

  return orders;
};

const getUsersOrderHistory = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      orderItems: {
        include: {
          product: true, // Include product details
        },
      },
      user: true, // Include user who placed the order
      payment: true, // Include payment details
    },
  });

  return orders;
};

export const OrderService = {
  createOrderIntoDB,
  getVendorOrderHistory,
  getUsersOrderHistory,
  //   getAllCategoriesFromDB,
  //   createCustomer,
};

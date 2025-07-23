import { OrderItem } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { paginationHelper } from "../../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";

export const createOrderIntoDB = async (userId: any, payload: any) => {
  const {
    shippingAddress,
    orderItems,
    shopId,
    customerName,
    customerEmail,
    phoneNumber,
  } = payload;

  const isSubscribed = await prisma.newsLetter.findFirst({
    where: {
      email: customerEmail,
      isDeleted: false,
    },
  });

  let totalPrice = orderItems.reduce((total: number, item: any) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 100);

  if (isSubscribed) {
    totalPrice = totalPrice * 0.8;
  }

  const transactionId = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  // Fetch cart before transaction
  const existingCart = await prisma.cart.findFirst({
    where: {
      customerId: userId,
    },
    include: {
      cartItem: true,
    },
  });

  // Prisma transaction
  const orderResult = await prisma.$transaction(
    async (tx) => {
      const order = await tx.order.create({
        data: {
          totalPrice,
          transactionId,
          shopId,
          customerName,
          customerEmail,
          phoneNumber,
          shippingAddress,
        },
      });

      const itemsToCreate = orderItems.map((item: OrderItem) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.orderItem.createMany({
        data: itemsToCreate,
      });

      if (isSubscribed) {
        await tx.newsLetter.update({
          where: {
            email: customerEmail,
          },
          data: {
            isDeleted: true,
          },
        });
      }

      // Clean up cart items and cart only if found
      if (existingCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: existingCart.id },
        });

        await tx.cart.delete({
          where: { id: existingCart.id },
        });
      }

      return {
        transactionId,
        totalPrice,
        customerName,
        customerEmail,
        customerPhone: phoneNumber,
        customerAddress: shippingAddress,
      };
    },
    {
      timeout: 30000,
    }
  );

  // Move external call OUTSIDE transaction
  const paymentSession = await initiatePayment(orderResult);

  return paymentSession;
};

const getVendorOrderHistory = async (paginationOption: any, email: string) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  // check is vendor exists
  const isVendorExists = await prisma.vendor.findUnique({
    where: {
      email,
      isDeleted: false,
    },
    select: {
      shop: {
        select: {
          id: true,
          order: {
            select: {
              customerEmail: true,
              customerName: true,
              id: true,
              totalPrice: true,
              createdAt: true,
              orderItem: {
                include: {
                  product: {
                    select: {
                      id: true,
                      images: true,
                      name: true,
                      price: true,
                    },
                  },
                },
              },
              paymentStatus: true,
              phoneNumber: true,
              profilePhoto: true,
              transactionId: true,
              status: true,
            },
            skip: skip,
            take: limit,
            orderBy: {
              [sortBy || "createdAt"]: sortOrder || "desc",
            },
          },
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: {
      shopId: isVendorExists?.shop?.id,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: isVendorExists,
  };
};

const getAllOrderHistory = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    include: {
      orderItem: true,
      shop: true,
    },
  });

  const total = await prisma.order.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: orders,
  };
};

const getUsersOrderHistory = async (email: string, paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const orders = await prisma.order.findMany({
    where: {
      customerEmail: email,
      isDeleted: false,
    },
    include: {
      orderItem: {
        where: {
          isDeleted: false,
        },
        include: {
          product: true,
        },
      },
      payment: true,
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.order.count({
    where: {
      customerEmail: email,
    },
  });

  console.log("orders", orders);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: orders,
  };
};

const getUserUnConfirmOrder = async (email: string) => {
  const isCustomerExists = await prisma.customer.findFirst({
    where: {
      email,
    },
  });
  const allOrders = await prisma.cart.findFirst({
    where: {
      customerId: isCustomerExists!.id,
      isDeleted: false,
    },
    include: {
      cartItem: true,
    },
  });

  return allOrders;
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

  if (idOrderExists.status !== "PENDING") {
    throw new Error("Order status must be PENDING to confirm.");
  }

  // Step 2: Update order status and handle stock decrement in a transaction
  await prisma.$transaction(async (tx) => {
    // Step 2.1: Update order status
    const order = await tx.order.update({
      where: { transactionId },
      data: {
        status: "CONFIRMED",
        totalPrice, // Update totalPrice here if needed
      },
      include: { orderItem: true },
    });

    for (const item of order.orderItem) {
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
        cartItem: true,
      },
    });
    for (const item of existingCart!.cartItem) {
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
    customerPhone: idOrderExists.phoneNumber,
    customerAddress: idOrderExists.shippingAddress,
  };

  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

// delete order
const deleteOrderFromDB = async (
  customerEmail: string,
  orderItemId: string
) => {
  // check if order exists
  const isOrderExists = await prisma.order.findFirst({
    where: {
      customerEmail,
      isDeleted: false,
    },
  });

  if (!isOrderExists) {
    throw new ApiError(404, "Order doesn't exists.");
  }

  // check is order item exists
  const isOrderItemExists = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
      isDeleted: false,
    },
  });

  if (!isOrderItemExists) {
    throw new ApiError(404, "Order Item doesn't exists.");
  }
  const result = await prisma.orderItem.update({
    where: {
      id: isOrderItemExists.id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
      order: {
        update: {
          where: {
            id: isOrderExists.id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
          },
        },
      },
    },
  });
  return result;
};

export const OrderService = {
  createOrderIntoDB,
  getVendorOrderHistory,
  getUsersOrderHistory,
  getAllOrderHistory,
  getUserUnConfirmOrder,
  updateOrder,
  deleteOrderFromDB,
};

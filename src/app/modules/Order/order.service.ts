import { Order, OrderItem } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { paginationHelper } from "../../../helpers/paginationHelper";

// const createOrderIntoDB = async (payload: any) => {
//   const {
//     customerShippingAddress,
//     orderItems,
//     shopId,
//     customerName,
//     customerEmail,
//     customerPhone,
//   } = payload;
//   console.log("order items", orderItems);
//   const totalPrice: number = orderItems?.reduce((total: number, item: any) => {
//     return total + Number(item.price) * Number(item.quantity);
//   }, 0);

//   // check is order exist
//   const isOrderExists = await prisma.order.findFirst({
//     where: {
//       customerEmail: payload?.customerEmail,
//     },
//   });
//   if (isOrderExists) {
//     const allOrderItems = orderItems.map((item: any) => ({
//       orderId: isOrderExists.id,
//       productId: item.productId,
//       quantity: Number(item.quantity),
//       price: Number(item.price),
//     }));

//     return await prisma.orderItem.createMany({
//       data: allOrderItems,
//     });
//   } else {
//     const result = await prisma.$transaction(async (prisma) => {
//       // Create order
//       const timestamp = Date.now();
//       const randomStr = Math.random().toString(36).substring(2, 10);
//       const transactionId = `txn_${timestamp}_${randomStr}`;

//       const orderInfo = await prisma.order.create({
//         data: {
//           totalPrice,
//           customerShippingAddress,
//           transactionId,
//           shopId,
//           customerName,
//           customerEmail,
//           customerPhone,
//         },
//       });

//       // Create order items
//       const allOrderItems = orderItems.map((item: any) => ({
//         orderId: orderInfo.id,
//         productId: item.productId,
//         quantity: Number(item.quantity),
//         price: Number(item.price),
//       }));

//       await prisma.orderItem.createMany({
//         data: allOrderItems,
//       });
//     });
//     return result;
//   }

//   // Use a transaction to ensure atomicity

//   // return result;
// };

// export const createOrderIntoDB = async (payload: any) => {
//   const {
//     shippingAddress,
//     orderItems,
//     shopId,
//     customerName,
//     customerEmail,
//     phoneNumber,
//   } = payload;

//   const totalPrice = orderItems.reduce((total: number, item: any) => {
//     return total + item.price * item.quantity;
//   }, 0);

//   const existingOrder = await prisma.order.findFirst({
//     where: {
//       customerEmail,
//     },
//   });

//   if (existingOrder) {
//     const additionalItems = orderItems.map((item) => ({
//       orderId: existingOrder.id,
//       productId: item.productId,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     await prisma.orderItem.createMany({
//       data: additionalItems,
//     });

//     // Just return the existing order
//     return existingOrder;
//   } else {
//     const transactionId = `txn_${Date.now()}_${Math.random()
//       .toString(36)
//       .substring(2, 10)}`;

//     const result = await prisma.$transaction(async (tx) => {
//       const order = await tx.order.create({
//         data: {
//           totalPrice,
//           transactionId,
//           shopId,
//           customerName,
//           customerEmail,
//           phoneNumber,
//           shippingAddress,
//         },
//       });

//       const itemsToCreate = orderItems.map((item) => ({
//         orderId: order.id,
//         productId: item.productId,
//         quantity: item.quantity,
//         price: item.price,
//       }));

//       await tx.orderItem.createMany({
//         data: itemsToCreate,
//       });

//       return order;
//     });

//     return result;
//   }
// };

export const createOrderIntoDB = async (userId: any, payload: any) => {
  const {
    shippingAddress,
    orderItems,
    shopId,
    customerName,
    customerEmail,
    phoneNumber,
  } = payload;
  console.log("from order", payload);

  const totalPrice = orderItems.reduce((total: number, item: any) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);

  // const existingOrder = await prisma.order.findFirst({
  //   where: {
  //     customerEmail,
  //   },
  // });

  //   const additionalItems = orderItems.map((item) => ({
  //     orderId: existingOrder.id,
  //     productId: item.productId,
  //     quantity: item.quantity,
  //     price: item.price,
  //   }));

  //   await prisma.orderItem.createMany({
  //     data: additionalItems,
  //   });

  //   // Just return the existing order
  //   return existingOrder;

  const transactionId = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  const result = await prisma.$transaction(async (tx) => {
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

    const isCustomerExists = await prisma.customer.findFirst({
      where: {
        userId,
        isDeleted: false,
      },
    });

    console.log("is customer exist", isCustomerExists);

    const existingCart = await prisma.cart.findFirst({
      where: {
        customerId: isCustomerExists!.id,
      },
      include: {
        cartItem: true,
      },
    });
    console.log("cartItem"), existingCart;
    for (const item of existingCart!.cartItem) {
      await tx.cartItem.deleteMany({
        where: { cartId: existingCart!.id },
      });
    }

    // Step 2.3: Clear the user's cart and cart items after confirming the order
    await tx.cart.delete({
      where: { id: existingCart!.id },
    });

    const paymentData = {
      transactionId,
      totalPrice,
      customerName,
      customerEmail,
      customerPhone: phoneNumber,
      customerAddress: shippingAddress,
    };

    const paymentSession = await initiatePayment(paymentData);

    return paymentSession;
  });

  return result;
};

const getVendorOrderHistory = async (email: string) => {
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
          },
        },
      },
    },
  });
  // const orders = await prisma.order.findMany({
  //   where: {
  //     shop: {
  //       vendorId,
  //     },
  //   },
  //   include: {
  //     orderItem: true,
  //     shop: true,
  //   },
  // });

  return isVendorExists;
};

const getAllCategoriesFromDB = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const result = await prisma.category.findMany({
    where: { isDeleted: false },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.category.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
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
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  const total = await prisma.order.count({
    where: {
      customerEmail: email,
    },
  });

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
  // const allOrder = await prisma.cart.findMany({
  //   where: {
  //     customerId:
  //   }
  // })
  const allOrders = await prisma.cart.findFirst({
    where: {
      customerId: isCustomerExists!.id,
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

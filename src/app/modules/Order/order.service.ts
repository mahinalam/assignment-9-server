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

  // find subscription throw email
  const isSubscribed = await prisma.newsLetter.findFirst({
    where: {
      email: customerEmail,
      isDeleted: false,
    },
  });

  let totalPrice = orderItems.reduce((total: number, item: any) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 100);

  const transactionId = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  // cretae order
  const result = await prisma.$transaction(async (tx) => {
    if (isSubscribed) {
      totalPrice = totalPrice * 0.8;

      await tx.newsLetter.update({
        where: {
          email: customerEmail,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      });
    }
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

    // create order items
    const itemsToCreate = orderItems.map((item: OrderItem) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await tx.orderItem.createMany({
      data: itemsToCreate,
    });

    const paymentData = {
      transactionId,
      totalPrice,
      customerName,
      customerEmail,
      customerPhone: phoneNumber,
      customerAddress: shippingAddress,
    };

    return paymentData;
  });

  const isCustomerExists = await prisma.customer.findFirst({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  const existingCart = await prisma.cart.findFirst({
    where: {
      customerId: isCustomerExists!.id,
    },
    include: {
      cartItem: true,
    },
  });

  for (const item of existingCart!.cartItem) {
    await prisma.cartItem.deleteMany({
      where: { cartId: existingCart!.id },
    });
  }

  // Step 2.3: Clear the user's cart and cart items after confirming the order
  await prisma.cart.delete({
    where: { id: existingCart!.id },
  });
  const paymentSession = await initiatePayment(result);

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
      orderItem: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
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
  deleteOrderFromDB,
};

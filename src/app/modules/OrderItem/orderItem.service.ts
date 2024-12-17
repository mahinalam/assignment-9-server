// model OrderItem {
//     id        String   @id @default(uuid())
//     quantity  Int
//     price     Float
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     isDeleted Boolean  @default(false)

//     productId String

//     product Product @relation(fields: [productId], references: [id])
//     orderId String
//     order   Order   @relation(fields: [orderId], references: [id])
//   }

import { Category, Order, OrderItem, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";

const createOrderItemIntoDB = async (payload: OrderItem) => {
  const result = await prisma.orderItem.create({
    data: payload,
  });

  return result;
};

const getOrderItemsFromDB = async () => {
  const result = await prisma.orderItem.findMany();
  return result;
};

export const OrderItemService = {
  createOrderItemIntoDB,
  getOrderItemsFromDB,
  //   getAllCategoriesFromDB,
  //   createCustomer,
};

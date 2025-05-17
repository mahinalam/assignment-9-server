import { Brand, Category, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

const createBrandIntoDB = async (payload: Brand) => {
  // check is brand exists
  const isBrandExists = await prisma.brand.findFirst({
    where: { name: payload.name },
  });
  if (isBrandExists) {
    throw new ApiError(400, "Brand already exists!");
  }

  // is brand deleted
  if ((isBrandExists as any)?.isDeleted) {
    throw new ApiError(400, "Brand already deleted!");
  }
  const result = await prisma.brand.create({
    data: payload,
  });

  return result;
};

const getAllBrandFromDB = async () => {
  const result = await prisma.brand.findMany();
  return result;
};

export const BrandService = {
  createBrandIntoDB,
  getAllBrandFromDB,
  //   createCustomer,
};

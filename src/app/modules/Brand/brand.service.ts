import { Brand, Category, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";

const createBrandIntoDB = async (payload: Brand) => {
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

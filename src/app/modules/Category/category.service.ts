import { Category, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";

const createCategoryIntoDB = async (payload: Category) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  //   createCustomer,
};

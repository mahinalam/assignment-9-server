import { Category, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createCategoryIntoDB = async (payload: Category, image: TImageFile) => {
  // check is category exists
  const isCategoryExists = await prisma.category.findFirst({
    where: { name: payload.name, isDeleted: false },
  });
  if (isCategoryExists) {
    throw new ApiError(400, "Category already exists!");
  }

  // is category deleted
  if ((isCategoryExists as any)?.isDeleted) {
    throw new ApiError(400, "Category already deleted!");
  }
  if (image) {
    payload.imageUrl = image.path;
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
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

  const total = await prisma.category.count({
    where: {
      isDeleted: false,
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCategory = async (categoryId: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });
  return result;
};

// delete category
const deleteCategoryFromDB = async (categoryId: string) => {
  const result = await prisma.category.update({
    where: {
      id: categoryId,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategory,
  deleteCategoryFromDB,
};

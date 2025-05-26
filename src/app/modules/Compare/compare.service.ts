import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

// get all compare
const getUsersCompareProduct = async (userId: string) => {
  const result = await prisma.compare.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      compareItem: {
        select: {
          compareId: true,
          product: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
              id: true,
              name: true,
              price: true,
              discount: true,
              stock: true,
              images: true,
            },
          },
        },
      },
    },
  });
  return result;
};

// create compare
const createCompareIntoDB = async (userId: any, productId: any) => {
  // check is user compare exist
  const isUserCompareExsits = await prisma.compare.findFirst({
    where: {
      userId,
    },
  });

  // count compare item
  if (isUserCompareExsits) {
    const total = await prisma.compareItem.count({
      where: {
        compareId: isUserCompareExsits?.id,
      },
    });

    if (total >= 3) {
      throw new ApiError(400, "You can compare upto 3 products.");
    }

    const isAlredayAdded = await prisma.compareItem.findFirst({
      where: {
        compareId: isUserCompareExsits.id,
        productId,
      },
    });

    if (isAlredayAdded) {
      throw new ApiError(400, "This product is already in your compare list.");
    }
    // create compare item

    const result = await prisma.compareItem.create({
      data: {
        productId,
        compareId: isUserCompareExsits.id,
      },
    });
    return result;
  } else {
    const result = await prisma.$transaction(async (tx) => {
      const createCompare = await tx.compare.create({
        data: {
          userId,
        },
      });
      await tx.compareItem.create({
        data: {
          productId,
          compareId: createCompare.id,
        },
      });
      return createCompare;
    });
    return result;
  }
};

const removeCompareProduct = async (userId: string, productId: string) => {
  // check is wishlist exists
  const isUserCompareExsits = await prisma.compare.findFirst({
    where: {
      userId,
    },
  });

  if (!isUserCompareExsits) {
    throw new ApiError(404, "Compare isn't exists.");
  }
  // check compare product
  const isCompareProductExists = await prisma.compareItem.findFirst({
    where: {
      productId,
    },
  });

  if (!isCompareProductExists) {
    throw new ApiError(404, "Product isn't exists.");
  }

  const result = await prisma.compareItem.delete({
    where: {
      compareId_productId: {
        compareId: isUserCompareExsits.id,
        productId,
      },
    },
  });
  return result;
};

export const CompareService = {
  getUsersCompareProduct,
  createCompareIntoDB,
  removeCompareProduct,
};

import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

// get all compare
const getUsersCompareProduct = async (userId: string) => {
  const result = await prisma.compare.findMany({
    where: {
      userId,
    },
    select: {
      userId: true,
      product: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
          shop: {
            select: {
              id: true,
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
  });
  return result;
};

// create compare
// const createCompareIntoDB = async (userId: any, productId: any) => {
//   // check is user compare exist
//   const isUserCompareExsits = await prisma.compare.findFirst({
//     where: {
//       userId,
//       productId,
//       isDeleted: false,
//     },
//   });

//   // count compare item
//   if (isUserCompareExsits) {
//     const total = await prisma.compare.count({
//       where: {
//         userId,
//       },
//     });

//     if (total >= 3) {
//       throw new ApiError(400, "You can compare upto 3 products.");
//     }

//     const isAlredayAdded = await prisma.compare.findFirst({
//       where: {
//         compareId: isUserCompareExsits.id,
//         productId,
//       },
//     });

//     if (isAlredayAdded) {
//       throw new ApiError(400, "This product is already in your compare list.");
//     }
//     // create compare item

//     const result = await prisma.compareItem.create({
//       data: {
//         productId,
//         compareId: isUserCompareExsits.id,
//       },
//     });
//     return result;
//   } else {
//     const result = await prisma.$transaction(async (tx) => {
//       const createCompare = await tx.compare.create({
//         data: {
//           userId,
//         },
//       });
//       await tx.compareItem.create({
//         data: {
//           productId,
//           compareId: createCompare.id,
//         },
//       });
//       return createCompare;
//     });
//     return result;
//   }
// };

const createCompareIntoDB = async (userId: string, productId: string) => {
  // Count total compare entries for the user
  const total = await prisma.compare.count({
    where: {
      userId,
      isDeleted: false,
    },
  });

  if (total >= 3) {
    throw new ApiError(400, "You can compare up to 3 products.");
  }

  // Check if product already compared
  const isAlreadyCompared = await prisma.compare.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (isAlreadyCompared && !isAlreadyCompared.isDeleted) {
    throw new ApiError(400, "This product is already in your compare list.");
  }

  // Create or undelete compare entry
  const result = await prisma.compare.create({
    data: {
      userId,
      productId,
    },
  });

  return result;
};

const removeCompareProduct = async (userId: string, productId: string) => {
  // check is wishlist exists
  const isUserCompareExsits = await prisma.compare.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (!isUserCompareExsits) {
    throw new ApiError(404, "Compare product isn't exists.");
  }

  const result = await prisma.compare.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
      isDeleted: false,
    },
  });
  return result;
};

export const CompareService = {
  getUsersCompareProduct,
  createCompareIntoDB,
  removeCompareProduct,
};

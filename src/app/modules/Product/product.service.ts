import { TImageFiles } from "../../interfaces/file";
import { Prisma, Product } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  productSearchAbleFields,
  vendorProductSearchAbleFields,
} from "./product.constant";

// const getAllProductsFromDB = async (
//   fieldParams: any,
//   paginationOption: any
// ) => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const { searchTerm, ...filterData } = fieldParams;
//   console.log("from service", filterData);
//   const andCondition: Prisma.ProductWhereInput[] = [];

//   // search params
//   if (fieldParams.searchTerm) {
//     andCondition.push({
//       OR: productSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: fieldParams.searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   // specific field
//   if (Object.keys(filterData)?.length > 0) {
//     andCondition.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: filterData[key],
//         },
//       })),
//     });
//   }

//   const whereCondition: Prisma.ProductWhereInput = { AND: andCondition };

//   const result = await prisma.product.findMany({
//     where: whereCondition,
//     skip: skip,
//     take: limit,
//     include: {
//       review: true,
//     },
//   });

//   const total = await prisma.product.count({
//     where: whereCondition,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// const getAllProductsFromDB = async (
//   rating,
//   brandId,
//   categoryId,
//   priceMin,
//   priceMax,
//   searchTerm,
//   sortOrder,
//   page,
//   limit
// ) => {
//   // const products = await prisma.product.findMany({
//   //   where: {
//   //     AND: [
//   //       brandId ? { brandId } : {},
//   //       categoryId ? { categoryId } : {},
//   //       priceMin || priceMax
//   //         ? {
//   //             newPrice: {
//   //               gte: priceMin || undefined,
//   //               lte: priceMax || undefined,
//   //             },
//   //           }
//   //         : {},
//   //       rating
//   //         ? {
//   //             review: {
//   //               some: {
//   //                 rating: {
//   //                   gte: rating,
//   //                 },
//   //               },
//   //             },
//   //           }
//   //         : {},
//   //       searchTerm
//   //         ? {
//   //             OR: [
//   //               {
//   //                 name: {
//   //                   contains: searchTerm,
//   //                   mode: "insensitive", // Case-insensitive search
//   //                 },
//   //               },
//   //               {
//   //                 description: {
//   //                   contains: searchTerm,
//   //                   mode: "insensitive",
//   //                 },
//   //               },
//   //             ],
//   //           }
//   //         : {},
//   //     ],
//   //   },
//   //   include: {
//   //     category: true,
//   //     review: true,
//   //     brand: true,
//   //   },
//   // });

//   const whereInput = [];
//   if()

//   return products;
// };

// get all featured products
const getAllFeaturedProductsFromDB = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.product.findMany({
    where: {
      isDeleted: false,
      isFeatured: true,
    },
    select: {
      id: true,
      name: true,
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      shop: {
        select: {
          name: true,
        },
      },
      price: true,
      stock: true,
      images: true,
      discount: true,
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });
  const total = await prisma.product.count({
    where: { isDeleted: false, isFeatured: true },
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

// get all flash products
const getAllFlashProductsFromDB = async (paginationOption: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const result = await prisma.product.findMany({
    where: {
      isDeleted: false,
      isFlashed: true,
    },
    select: {
      id: true,
      name: true,
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      shop: {
        select: {
          name: true,
        },
      },
      review: {
        select: {
          comment: true,
          createdAt: true,
        },
      },
      price: true,
      stock: true,
      images: true,
      discount: true,
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });
  const total = await prisma.product.count({
    where: { isDeleted: false, isFlashed: true },
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

const getAllProductsFromDB = async (
  fieldParams: any,
  paginationOption: any
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  const { searchTerm, priceMin, priceMax, rating, brandId, categoryId } =
    fieldParams;

  const andCondition: Prisma.ProductWhereInput[] = [];

  // Search functionality
  if (searchTerm) {
    andCondition.push({
      OR: productSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter by specific fields
  if (priceMin || priceMax) {
    andCondition.push({
      AND: [
        priceMin ? { price: { gte: parseInt(priceMin, 10) } } : {},
        priceMax ? { price: { lte: parseInt(priceMax, 10) } } : {},
      ],
    });
  }

  if (rating) {
    andCondition.push({
      review: {
        some: {
          rating: {
            gte: parseInt(rating, 10),
          },
        },
      },
    });
  }

  if (brandId) {
    andCondition.push({ brandId: brandId });
  }

  if (categoryId) {
    if (categoryId === "all") {
      andCondition.push({});
    } else {
      andCondition.push({ categoryId });
    }
  }

  // Combine all conditions
  const whereCondition: Prisma.ProductWhereInput = {
    AND: andCondition,
    isDeleted: false,
    isFeatured: false,
    isFlashed: false,
  };

  // Query database
  const result = await prisma.product.findMany({
    where: whereCondition,
    include: {
      review: true,
      brand: true,
      category: true,
      shop: true,
    },
    skip: skip,
    take: limit,

    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  const total = await prisma.product.count({
    where: whereCondition,
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

// create product
const createProductIntoDB = async (payload: Product, images: TImageFiles) => {
  // check is shop exits
  await prisma.shop.findFirstOrThrow({
    where: {
      id: payload.shopId,
      isDeleted: false,
    },
  });

  // check is category exists
  await prisma.category.findFirstOrThrow({
    where: {
      id: payload.categoryId,
      isDeleted: false,
    },
  });

  const productData = {
    ...payload,
    price: Number(payload.price),
    stock: Number(payload.stock),
    discount: payload?.discount ? Number(payload.discount) : 0,
  };

  const { itemImages } = images;
  console.log("items images", itemImages);
  if (images) {
    const newImagePaths = itemImages.map((image) => image.path);

    productData.images = newImagePaths;
  }

  const result = await prisma.product.create({
    data: productData,
  });

  return result;
};

// update product
const updateProductIntoDB = async (payload: Product, images: TImageFiles) => {
  console.log("images", images);

  // Check if product exists
  await prisma.product.findFirstOrThrow({
    where: {
      id: payload.id,
      isDeleted: false,
    },
  });

  // Check if category exists
  await prisma.category.findFirstOrThrow({
    where: {
      id: payload.categoryId,
      isDeleted: false,
    },
  });

  const updatedProductData: any = {
    ...payload,
    price: Number(payload.price),
    stock: Number(payload.stock),
    discount: payload?.discount ? Number(payload.discount) : 0,
  };

  const productImages = images?.itemImages;

  // If new images are provided, replace the old ones
  if (productImages && Object.keys(productImages).length > 0) {
    const newImagePaths = productImages.map((image) => image.path);

    updatedProductData.images = newImagePaths;
  } else {
    // Don't update the images field if no new images are provided
    delete updatedProductData.images;
  }

  const result = await prisma.product.update({
    where: {
      id: payload.id,
    },
    data: updatedProductData,
  });

  return result;
};

// get all vendor shop products
const getVendorShopProductsFromDB = async (shopId: string) => {
  const result = await prisma.shop.findFirst({
    where: {
      id: shopId,
      isDeleted: false,
    },
    include: {
      product: true,
      followingShop: true,
    },
  });
  return result;
};

// const getVendorProductsFromDB = async (
//   fieldParams: any,
//   paginationOption: any
// ) => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOption);
//   const { searchTerm, shopId } = fieldParams;

//   const andCondition: Prisma.ShopWhereInput[] = [];

//   // Search functionality
//   if (searchTerm) {
//     andCondition.push({
//       OR: vendorProductSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }
//   console.log("fields params", fieldParams);
//   if (shopId) {
//     andCondition.push({ id: shopId }, { isDeleted: false });
//   }

//   // Combine all conditions
//   const whereCondition: Prisma.ShopWhereInput = {
//     AND: andCondition,
//   };

//   // Query database
//   const result = await prisma.shop.findMany({
//     where: whereCondition,
//     skip: skip,
//     take: limit,
//     include: {
//       products: {
//         include: {
//           review: true,
//         },
//       },
//       followingShop: true,
//     },
//     orderBy: {
//       [sortBy || "createdAt"]: sortOrder || "desc",
//     },
//   });

//   const total = await prisma.shop.count({
//     where: whereCondition,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// get single  product from db
const getSingleProductFromDB = async (productId: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
    include: {
      shop: true,
      review: {
        select: {
          comment: true,
          createdAt: true,
          id: true,
          images: true,
          rating: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return result;
};

// const updateProductStatusIntoDB = async (payload: {
//   id: string;
//   status: any;
// }) => {
//   // check is shop exits
//   await prisma.product.findUniqueOrThrow({
//     where: {
//       id: payload.id,
//     },
//   });

//   const updatedData: Record<string, unknown> = {};

//   if (payload.status === "flash") {
//     updatedData.isFlashed = true;
//   }

//   if (payload.status === "featured") {
//     updatedData.isFeatured = true;
//   }

//   // update product status
//   const result = await prisma.product.update({
//     where: {
//       id: payload.id,
//       isDeleted: false,
//     },
//     data: updatedData,
//   });

//   return result;
// };

const updateProductStatusIntoDB = async (payload: {
  id: string;
  status: any;
}) => {
  console.log("id", payload.id);
  console.log("status", payload.status);
  // Check if product exists and is not deleted
  await prisma.product.findFirstOrThrow({
    where: {
      id: payload.id,
      isDeleted: false,
    },
  });

  // Build update object
  const dataToUpdate: any = {};

  if (payload?.status?.isFlashed) {
    dataToUpdate.isFlashed = true;
  } else {
    dataToUpdate.isFlashed = false;
  }

  if (payload?.status?.isFeatured) {
    dataToUpdate.isFeatured = true;
  } else {
    dataToUpdate.isFeatured = false;
  }

  // Update product
  const result = await prisma.product.update({
    where: {
      id: payload.id,
    },
    data: dataToUpdate,
  });

  return result;
};

// const updateVendorProductIntoDB = async (
//   id: string,
//   payload: Partial<Product>
// ) => {
//   console.log(id);
//   const result = await prisma.product.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: payload,
//   });

//   return result;
// };

const deleteVendorProductFromDB = async (id: string) => {
  const result = await prisma.product.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const ProductService = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  createProductIntoDB,
  getVendorShopProductsFromDB,
  updateProductIntoDB,
  deleteVendorProductFromDB,
  getAllFeaturedProductsFromDB,
  getAllFlashProductsFromDB,
  updateProductStatusIntoDB,
};

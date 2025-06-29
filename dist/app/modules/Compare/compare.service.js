"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// get all compare
const getUsersCompareProduct = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.compare.findMany({
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
});
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
const createCompareIntoDB = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Count total compare entries for the user
    const total = yield prisma_1.default.compare.count({
        where: {
            userId,
            isDeleted: false,
        },
    });
    if (total >= 3) {
        throw new ApiError_1.default(400, "You can compare up to 3 products.");
    }
    // Check if product already compared
    const isAlreadyCompared = yield prisma_1.default.compare.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
    if (isAlreadyCompared && !isAlreadyCompared.isDeleted) {
        throw new ApiError_1.default(400, "This product is already in your compare list.");
    }
    // Create or undelete compare entry
    const result = yield prisma_1.default.compare.create({
        data: {
            userId,
            productId,
        },
    });
    return result;
});
const removeCompareProduct = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // check is wishlist exists
    const isUserCompareExsits = yield prisma_1.default.compare.findFirst({
        where: {
            userId,
            productId,
        },
    });
    if (!isUserCompareExsits) {
        throw new ApiError_1.default(404, "Compare product isn't exists.");
    }
    const result = yield prisma_1.default.compare.delete({
        where: {
            userId_productId: {
                userId,
                productId,
            },
            isDeleted: false,
        },
    });
    return result;
});
exports.CompareService = {
    getUsersCompareProduct,
    createCompareIntoDB,
    removeCompareProduct,
};

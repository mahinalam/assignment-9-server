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
exports.OrderService = exports.createOrderIntoDB = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const payment_utils_1 = require("../Payment/payment.utils");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createOrderIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingAddress, orderItems, shopId, customerName, customerEmail, phoneNumber, } = payload;
    // find subscription throw email
    const isSubscribed = yield prisma_1.default.newsLetter.findFirst({
        where: {
            email: customerEmail,
            isDeleted: false,
        },
    });
    let totalPrice = orderItems.reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity);
    }, 100);
    const transactionId = `txn_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)}`;
    // cretae order
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (isSubscribed) {
            totalPrice = totalPrice * 0.8;
            yield tx.newsLetter.update({
                where: {
                    email: customerEmail,
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
            });
        }
        const order = yield tx.order.create({
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
        const itemsToCreate = orderItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        yield tx.orderItem.createMany({
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
    }));
    const isCustomerExists = yield prisma_1.default.customer.findFirst({
        where: {
            userId,
            isDeleted: false,
        },
        select: {
            id: true,
        },
    });
    const existingCart = yield prisma_1.default.cart.findFirst({
        where: {
            customerId: isCustomerExists.id,
        },
        include: {
            cartItem: true,
        },
    });
    for (const item of existingCart.cartItem) {
        yield prisma_1.default.cartItem.deleteMany({
            where: { cartId: existingCart.id },
        });
    }
    // Step 2.3: Clear the user's cart and cart items after confirming the order
    yield prisma_1.default.cart.delete({
        where: { id: existingCart.id },
    });
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(result);
    return paymentSession;
});
exports.createOrderIntoDB = createOrderIntoDB;
const getVendorOrderHistory = (paginationOption, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    // check is vendor exists
    const isVendorExists = yield prisma_1.default.vendor.findUnique({
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
    const total = yield prisma_1.default.order.count({
        where: {
            shopId: (_a = isVendorExists === null || isVendorExists === void 0 ? void 0 : isVendorExists.shop) === null || _a === void 0 ? void 0 : _a.id,
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
});
const getAllOrderHistory = (paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const orders = yield prisma_1.default.order.findMany({
        where: {
            isDeleted: false,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
        include: {
            orderItem: true,
            shop: true,
        },
    });
    const total = yield prisma_1.default.order.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: orders,
    };
});
const getUsersOrderHistory = (email, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOption);
    const orders = yield prisma_1.default.order.findMany({
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
    const total = yield prisma_1.default.order.count({
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
});
const getUserUnConfirmOrder = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isCustomerExists = yield prisma_1.default.customer.findFirst({
        where: {
            email,
        },
    });
    const allOrders = yield prisma_1.default.cart.findFirst({
        where: {
            customerId: isCustomerExists.id,
            isDeleted: false,
        },
        include: {
            cartItem: true,
        },
    });
    return allOrders;
});
// const updateOrder = async (payload: {
//   transactionId: string;
//   totalPrice: number;
// }) => {
//   const { transactionId, totalPrice } = payload;
//   // chcek if the order exists
//   const idOrderExists = await prisma.order.findUniqueOrThrow({
//     where: {
//       transactionId,
//     },
//   });
//   if (idOrderExists.orderStatus !== "PENDING") {
//     throw new Error("Order status must be PENDING to confirm.");
//   }
//   // Step 2: Update order status and handle stock decrement in a transaction
//   await prisma.$transaction(async (tx) => {
//     // Update the order
//     const order = await tx.order.update({
//       where: { transactionId },
//       data: {
//         orderStatus: "CONFIRMED",
//         totalPrice,
//       },
//       include: { orderItems: true },
//     });
//     // Decrement product quantities
//     for (const item of order.orderItems) {
//       await tx.product.update({
//         where: { id: item.productId },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }
//     return order;
//   });
//   const paymentData = {
//     transactionId,
//     totalPrice,
//     customerName: idOrderExists.customerName,
//     customerEmail: idOrderExists.customerEmail,
//     customerPhone: idOrderExists.customerPhone,
//     customerAddress: idOrderExists.customerShippingAddress,
//   };
//   // console.log("paymentData", paymentData);
//   const paymentSession = await initiatePayment(paymentData);
//   // console.log("paymentdata", paymentData);
//   return paymentSession;
//   // return orders;
// };
const updateOrder = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, totalPrice } = payload;
    // Check if the order exists
    const idOrderExists = yield prisma_1.default.order.findUniqueOrThrow({
        where: { transactionId },
    });
    if (idOrderExists.status !== "PENDING") {
        throw new Error("Order status must be PENDING to confirm.");
    }
    // Step 2: Update order status and handle stock decrement in a transaction
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Step 2.1: Update order status
        const order = yield tx.order.update({
            where: { transactionId },
            data: {
                status: "CONFIRMED",
                totalPrice, // Update totalPrice here if needed
            },
            include: { orderItem: true },
        });
        for (const item of order.orderItem) {
            yield tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        // step:2 find the cart
        const existingCart = yield prisma_1.default.cart.findFirst({
            where: {
                customerId: userId,
            },
            include: {
                cartItem: true,
            },
        });
        for (const item of existingCart.cartItem) {
            yield tx.cartItem.deleteMany({
                where: { cartId: existingCart.id },
            });
        }
        // Step 2.3: Clear the user's cart and cart items after confirming the order
        yield tx.cart.delete({
            where: { id: existingCart.id },
        });
    }));
    console.log("Order confirmed and cart cleared for User ID:", userId);
    // Step 3: Initiate the payment session
    const paymentData = {
        transactionId,
        totalPrice,
        customerName: idOrderExists.customerName,
        customerEmail: idOrderExists.customerEmail,
        customerPhone: idOrderExists.phoneNumber,
        customerAddress: idOrderExists.shippingAddress,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
// delete order
const deleteOrderFromDB = (customerEmail, orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if order exists
    const isOrderExists = yield prisma_1.default.order.findFirst({
        where: {
            customerEmail,
            isDeleted: false,
        },
    });
    if (!isOrderExists) {
        throw new ApiError_1.default(404, "Order doesn't exists.");
    }
    // check is order item exists
    const isOrderItemExists = yield prisma_1.default.orderItem.findFirst({
        where: {
            id: orderItemId,
            isDeleted: false,
        },
    });
    if (!isOrderItemExists) {
        throw new ApiError_1.default(404, "Order Item doesn't exists.");
    }
    const result = yield prisma_1.default.orderItem.update({
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
});
exports.OrderService = {
    createOrderIntoDB: exports.createOrderIntoDB,
    getVendorOrderHistory,
    getUsersOrderHistory,
    getAllOrderHistory,
    getUserUnConfirmOrder,
    updateOrder,
    deleteOrderFromDB,
};

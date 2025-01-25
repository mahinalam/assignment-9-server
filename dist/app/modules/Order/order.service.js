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
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const payment_utils_1 = require("../Payment/payment.utils");
const createOrderIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerShippingAddress, orderItems, shopId, customerName, customerEmail, customerPhone, } = payload;
    console.log("order items", orderItems);
    const totalPrice = orderItems === null || orderItems === void 0 ? void 0 : orderItems.reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity);
    }, 0);
    // Use a transaction to ensure atomicity
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Create order
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 10);
        const transactionId = `txn_${timestamp}_${randomStr}`;
        const orderInfo = yield prisma.order.create({
            data: {
                totalPrice,
                customerShippingAddress,
                transactionId,
                shopId,
                customerName,
                customerEmail,
                customerPhone,
            },
        });
        // Create order items
        const allOrderItems = orderItems.map((item) => ({
            orderId: orderInfo.id,
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price),
        }));
        yield prisma.orderItem.createMany({
            data: allOrderItems,
        });
        // const paymentData = {
        //   transactionId,
        //   totalPrice,
        //   customerName: orderInfo.customerName,
        //   customerEmail: orderInfo.customerEmail,
        //   customerPhone: orderInfo.customerPhone,
        //   customerAddress: orderInfo.customerShippingAddress,
        // };
        // // console.log("paymentData", paymentData);
        // const paymentSession = await initiatePayment(paymentData);
        // // console.log("paymentdata", paymentData);
        // return paymentSession;
    }));
    return result;
});
const getVendorOrderHistory = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            shop: {
                ownerId: vendorId,
            },
        },
        include: {
            orderItems: true,
            shop: true,
        },
    });
    return orders;
});
const getAllOrderHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            orderItems: true,
            shop: true,
        },
    });
    return orders;
});
const getUsersOrderHistory = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            customerEmail: email,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            payment: true,
        },
    });
    return orders;
});
const getUserUnConfirmOrder = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const allCarts = yield prisma_1.default.order.findFirst({
        where: {
            customerEmail: email,
            orderStatus: "PENDING",
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    return allCarts;
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
    if (idOrderExists.orderStatus !== "PENDING") {
        throw new Error("Order status must be PENDING to confirm.");
    }
    // Step 2: Update order status and handle stock decrement in a transaction
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Step 2.1: Update order status
        const order = yield tx.order.update({
            where: { transactionId },
            data: {
                orderStatus: "CONFIRMED",
                totalPrice, // Update totalPrice here if needed
            },
            include: { orderItems: true },
        });
        for (const item of order.orderItems) {
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
                cartItems: true,
            },
        });
        for (const item of existingCart.cartItems) {
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
        customerPhone: idOrderExists.customerPhone,
        customerAddress: idOrderExists.customerShippingAddress,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
exports.OrderService = {
    createOrderIntoDB,
    getVendorOrderHistory,
    getUsersOrderHistory,
    getAllOrderHistory,
    getUserUnConfirmOrder,
    updateOrder,
};

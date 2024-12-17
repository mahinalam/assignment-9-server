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
    const { userId, shippingAddress, orderItems } = payload;
    const totalPrice = orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    // Use a transaction to ensure atomicity
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Create order
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 10);
        const transactionId = `txn_${timestamp}_${randomStr}`;
        const orderInfo = yield prisma.order.create({
            data: {
                userId,
                totalPrice,
                shippingAddress,
                transactionId,
            },
            include: {
                user: true,
            },
        });
        // Create order items
        const allOrderItems = orderItems.map((item) => ({
            orderId: orderInfo.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        yield prisma.orderItem.createMany({
            data: allOrderItems,
        });
        const paymentData = {
            transactionId,
            totalPrice,
            customerName: orderInfo.user.name,
            customerEmail: orderInfo.user.email,
            customerPhone: orderInfo.user.phoneNumber,
            customerAddress: orderInfo.user.address,
        };
        // console.log("paymentData", paymentData);
        const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
        console.log("paymentSession", paymentSession);
        return paymentSession;
    }));
    return result;
});
// const getAllCategoriesFromDB = async () => {
//   const result = await prisma.category.findMany();
//   return result;
// };
const getVendorOrderHistory = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            orderItems: {
                some: {
                    product: {
                        shop: {
                            ownerId: vendorId,
                        },
                    },
                },
            },
        },
        include: {
            orderItems: {
                include: {
                    product: true, // Include product details
                },
            },
            user: true, // Include user who placed the order
            payment: true, // Include payment details
        },
    });
    return orders;
});
const getUsersOrderHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            userId,
        },
        include: {
            orderItems: {
                include: {
                    product: true, // Include product details
                },
            },
            user: true, // Include user who placed the order
            payment: true, // Include payment details
        },
    });
    return orders;
});
exports.OrderService = {
    createOrderIntoDB,
    getVendorOrderHistory,
    getUsersOrderHistory,
    //   getAllCategoriesFromDB,
    //   createCustomer,
};

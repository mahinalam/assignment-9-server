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
exports.paymentServices = void 0;
/* eslint-disable no-unused-vars */
const path_1 = require("path");
const payment_utils_1 = require("./payment.utils");
const fs_1 = require("fs");
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const confirmationService = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let message;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Step 2.1: Update order status
            const order = yield tx.order.update({
                where: { transactionId },
                data: {
                    status: "CONFIRMED",
                    paymentStatus: "COMPLETED", // Update totalPrice here if needed
                },
                include: { orderItem: true },
            });
            for (const item of order.orderItem) {
                yield tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
        }));
        message = "Successfully Paid!";
    }
    else {
        message = "Payment Failed!";
    }
    const filePath = (0, path_1.join)(__dirname, "../../../views/confirmation.html");
    let template = (0, fs_1.readFileSync)(filePath, "utf-8");
    template = template.replace(`{{message}}`, message);
    return template;
});
exports.paymentServices = {
    confirmationService,
};

"use strict";
/* eslint-disable no-unused-vars */
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
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
//   let message;
//   if (verifyResponse && verifyResponse.pay_status === "Successful") {
//     await prisma.$transaction(async (tx) => {
//       // Step 2.1: Update order status
//       const order = await tx.order.update({
//         where: { transactionId },
//         data: {
//           status: "CONFIRMED",
//           paymentStatus: "COMPLETED", // Update totalPrice here if needed
//         },
//         include: { orderItem: true },
//       });
//       for (const item of order.orderItem) {
//         await tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.quantity } },
//         });
//       }
//     });
//     message = "Successfully Paid!";
//   } else {
//     message = "Payment Failed!";
//   }
//   const filePath = join(__dirname, "../../../views/confirmation.html");
//   let template = readFileSync(filePath, "utf-8");
//   template = template.replace(`{{message}}`, message);
//   return template;
// };
const confirmationService = (paymentSuccess) => __awaiter(void 0, void 0, void 0, function* () {
    // validation
    const { data } = yield axios_1.default.get(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${paymentSuccess === null || paymentSuccess === void 0 ? void 0 : paymentSuccess.val_id}&store_id=${config_1.default.store_id}&store_passwd=${config_1.default.store_password}`);
    if ((data === null || data === void 0 ? void 0 : data.status) !== "VALID") {
        return false;
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Step 2.1: Update order status
        const order = yield tx.order.update({
            where: { transactionId: data === null || data === void 0 ? void 0 : data.tran_id },
            data: {
                status: "CONFIRMED",
                paymentStatus: "COMPLETED",
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
    return true;
});
exports.paymentServices = {
    confirmationService,
};

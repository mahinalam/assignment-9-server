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
exports.verifyPayment = exports.initiatePayment = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// export const initiatePayment = async (paymentData: any) => {
//   try {
//   } catch (err) {
//     throw new Error("Payment initiation failed!");
//   }
// };
const initiatePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(process.env.PAYMENT_URL, {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        tran_id: paymentData.transactionId,
        success_url: `http://localhost:5000/api/v1/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
        fail_url: `http://localhost:5000/api/v1/payment/confirmation?status=failed`,
        cancel_url: "http://localhost:3000",
        amount: paymentData.totalPrice,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: paymentData.customerName,
        cus_email: paymentData.customerEmail,
        cus_add1: paymentData.customerAddress,
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_state: "Dhaka",
        cus_postcode: "N/A",
        cus_country: "N/A",
        cus_phone: paymentData.customerPhone,
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (tnxId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(process.env.PAYMENT_VERIFY_URL, {
            params: {
                store_id: process.env.STORE_ID,
                signature_key: process.env.SIGNATURE_KEY,
                type: "json",
                request_id: tnxId,
            },
        });
        console.log("response data", response);
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw new Error("Payment validation failed!");
    }
});
exports.verifyPayment = verifyPayment;

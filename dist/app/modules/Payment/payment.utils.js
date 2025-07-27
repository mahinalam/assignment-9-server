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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("../../../config"));
dotenv_1.default.config();
const initiatePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const response = await axios.post(process.env.PAYMENT_URL as string, {
    //   store_id: process.env.STORE_ID,
    //   signature_key: process.env.SIGNATURE_KEY,
    //   tran_id: paymentData.transactionId,
    //   success_url: `https://electromert-ecommerce-server.vercel.app/api/v1/payment/confirmation?transactionId=${paymentData.transactionId}&status=success`,
    //   fail_url: `https://electromert-ecommerce-server.vercel.app/api/v1/payment/confirmation?status=failed`,
    //   cancel_url: "https://electromert-ecommerce-client.vercel.app",
    //   amount: paymentData.totalPrice,
    //   currency: "BDT",
    //   desc: "Merchant Registration Payment",
    //   cus_name: paymentData.customerName,
    //   cus_email: paymentData.customerEmail,
    //   cus_add1: paymentData.customerAddress,
    //   cus_add2: "N/A",
    //   cus_city: "N/A",
    //   cus_state: "Dhaka",
    //   cus_postcode: "N/A",
    //   cus_country: "N/A",
    //   cus_phone: paymentData.customerPhone,
    //   type: "json",
    // });
    // return response.data;
    const initiate = {
        store_id: config_1.default.store_id,
        store_passwd: config_1.default.store_password,
        total_amount: paymentData.totalPrice,
        currency: "BDT",
        tran_id: paymentData.transactionId,
        success_url: `${config_1.default.payment_success_url}`,
        fail_url: `${config_1.default.payment_fail_url}`,
        cancel_url: config_1.default.payment_cancel_url,
        ipn_url: config_1.default.payment_success_url,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: paymentData.customerName,
        cus_email: paymentData.customerEmail,
        cus_add1: paymentData.customerAddress,
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: paymentData.customerPhone,
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: paymentData.customerAddress,
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
    };
    const iniResponse = yield (0, axios_1.default)({
        url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        method: "POST",
        data: initiate,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const gatewayUrl = (_a = iniResponse === null || iniResponse === void 0 ? void 0 : iniResponse.data) === null || _a === void 0 ? void 0 : _a.GatewayPageURL;
    return { gatewayUrl };
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
        return response.data;
    }
    catch (err) {
        throw new Error("Payment validation failed!");
    }
});
exports.verifyPayment = verifyPayment;

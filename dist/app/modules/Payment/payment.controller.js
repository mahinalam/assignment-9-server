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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const config_1 = __importDefault(require("../../../config"));
const paymentConfirmationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const successPayment = req.body;
    const isVerifiedSuccess = yield payment_service_1.paymentServices.confirmationService(successPayment);
    if (!isVerifiedSuccess) {
        return res.redirect(`${config_1.default.payment_cancel_url}/payment/success?token=${config_1.default.valid_success_token}`);
    }
    return res.redirect(`${config_1.default.payment_cancel_url}/payment/failed?token=${config_1.default.valid_failed_token}`);
});
exports.PaymentController = {
    paymentConfirmationController,
};

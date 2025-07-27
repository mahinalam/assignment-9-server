import axios from "axios";
import dotenv from "dotenv";
import config from "../../../config";
dotenv.config();

export const initiatePayment = async (paymentData: any) => {
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
    store_id: config.store_id,
    store_passwd: config.store_password,
    total_amount: paymentData.totalPrice,
    currency: "BDT",
    tran_id: paymentData.transactionId,
    success_url: `${config.payment_success_url}`,
    fail_url: `${config.payment_fail_url}`,
    cancel_url: config.payment_cancel_url,
    ipn_url: config.payment_success_url,
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

  const iniResponse = await axios({
    url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    method: "POST",
    data: initiate,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const gatewayUrl = iniResponse?.data?.GatewayPageURL;
  return { gatewayUrl };
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error("Payment validation failed!");
  }
};

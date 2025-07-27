import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASS,
  store_id: process.env.STORE_ID,
  store_password: process.env.STORE_PASSWORD,
  payment_success_url: process.env.PAYMENT_SUCCESS_URL,
  payment_fail_url: process.env.PAYMENT_FAIL_URL,
  payment_cancel_url: process.env.PAYMENT_CANCEL_URL,
  valid_success_token: process.env.VALID_SUCCESS_TOKEN,
  valid_failed_token: process.env.VALID_FAILED_TOKEN,
};

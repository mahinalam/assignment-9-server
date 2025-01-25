import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ShopController } from "./shop.controller";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.VENDOR),
  multerUpload.single("logoImage"),
  parseBody,
  ShopController.createShop
);
router.post("/follow-shop", auth(UserRole.USER), ShopController.followShop);

router.get("/", ShopController.getAllShop);
router.get("/vendor-shop", ShopController.getVendorShop);

export const ShopRoute = router;

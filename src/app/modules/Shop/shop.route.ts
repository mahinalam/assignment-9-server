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
router.post("/follow-shop", auth(UserRole.CUSTOMER), ShopController.followShop);

router.get("/vendor-shop", auth(UserRole.VENDOR), ShopController.getVendorShop);
router.get("/", ShopController.getAllShop);

router.put(
  "/",
  multerUpload.single("logoImage"),
  parseBody,
  auth(UserRole.VENDOR),
  ShopController.updateShop
);
router.delete("/:id", auth(UserRole.ADMIN), ShopController.blockShop);

export const ShopRoute = router;

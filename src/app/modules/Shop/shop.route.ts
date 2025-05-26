import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ShopController } from "./shop.controller";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get(
  "/following-shop",
  auth(UserRole.CUSTOMER),
  ShopController.getUsersFollowingShop
);

router.get("/vendor-shop", auth(UserRole.VENDOR), ShopController.getVendorShop);
router.get("/", ShopController.getAllShop);
router.get(
  "/isFollowing/:id",
  auth(UserRole.CUSTOMER),
  ShopController.getIsFollowingShop
);
router.post(
  "/",
  auth(UserRole.VENDOR),
  multerUpload.single("logoImage"),
  parseBody,
  ShopController.createShop
);
router.post("/follow-shop", auth(UserRole.CUSTOMER), ShopController.followShop);

router.put(
  "/",
  multerUpload.single("logoImage"),
  parseBody,
  auth(UserRole.VENDOR),
  ShopController.updateShop
);
router.delete("/:id", auth(UserRole.ADMIN), ShopController.blockShop);
router.delete(
  "/user/unfollow-shop/:id",
  auth(UserRole.CUSTOMER),
  ShopController.unfollowShop
);

export const ShopRoute = router;

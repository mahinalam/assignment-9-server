import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

import { WishlistController } from "../Wishlist/wishlist.controller";

const router = express.Router();

router.get("/", auth(UserRole.CUSTOMER), WishlistController.getUsersWishlists);
router.post("/", auth(UserRole.CUSTOMER), WishlistController.createWishlist);

router.delete(
  "/:id",
  auth(UserRole.CUSTOMER),
  WishlistController.removeFromWishlist
);

export const WishlistRoute = router;

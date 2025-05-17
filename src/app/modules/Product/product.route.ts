import express from "express";
import { ProductController } from "./product.controller";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", ProductController.getAllProducts);
//
router.post(
  "/",
  auth(UserRole.VENDOR),
  multerUpload.fields([{ name: "itemImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  ProductController.createProduct
);

router.get("/vendor-products/:id", ProductController.getAllVendorProducts);
router.get("/single-product/:id", ProductController.getSingleProductFromDB);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  ProductController.updateVendorShopProduct
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  ProductController.deleteVendorShopProduct
);

export const ProductRoute = router;

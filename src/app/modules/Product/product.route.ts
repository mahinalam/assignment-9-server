import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ProductController } from "./product.controller";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get(
  "/",
  // auth(UserRole.ADMIN),
  ProductController.getAllProducts
);

router.get(
  "/:id",
  // auth(UserRole.ADMIN),
  ProductController.getSingleProductFromDB
);

router.post(
  "/",
  // auth(UserRole.VENDOR),
  multerUpload.fields([{ name: "itemImages" }]),
  // multerUpload.fields([{ name: 'itemImages' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  ProductController.createProduct
);

router.get(
  "/vendor-products/:id",
  // auth(UserRole.ADMIN),
  ProductController.getAllVendorProducts
);

router.patch(
  "/:id",
  // auth(UserRole.ADMIN),
  ProductController.updateVendorShopProduct
);
router.delete(
  "/:id",
  // auth(UserRole.ADMIN),
  ProductController.deleteVendorShopProduct
);

export const ProductRoute = router;

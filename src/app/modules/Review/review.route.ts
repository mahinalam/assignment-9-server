import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
// import { CategoryController } from "./category.controller";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  // auth(UserRole.USER),
  multerUpload.fields([{ name: "reviewImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  ReviewController.createReview
);

router.get(
  "/vendor-products-reviews/:id",
  // auth(UserRole.ADMIN),
  ReviewController.getVendorProductsReviews
);
router.get(
  "/user-products-reviews/:id",
  // auth(UserRole.ADMIN),
  ReviewController.getUserProductReview
);

router.get(
  "/:id",
  // auth(UserRole.ADMIN),
  ReviewController.getProductSpecificReviews
);

export const ReviewRoute = router;

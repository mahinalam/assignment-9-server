import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER),
  multerUpload.fields([{ name: "reviewImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  ReviewController.createReview
);

router.get(
  "/vendor-products-reviews/:id",
  ReviewController.getVendorProductsReviews
);
router.get("/user-products-reviews/:id", ReviewController.getUserProductReview);

router.get("/:id", ReviewController.getProductSpecificReviews);

export const ReviewRoute = router;

import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), ReviewController.getAllReviews);
router.get(
  "/vendor-products-reviews",
  auth(UserRole.VENDOR),
  ReviewController.getVendorProductsReviews
);

router.get(
  "/user-reviews/",
  auth(UserRole.CUSTOMER),
  ReviewController.getUserProductReview
);

router.get("/product/review", ReviewController.getProductSpecificReviews);
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  multerUpload.fields([{ name: "reviewImages" }]),
  // validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  ReviewController.createReview
);
router.post("/public", ReviewController.createPublicReview);

router.delete(
  "/:id",
  auth(UserRole.CUSTOMER),
  ReviewController.deleteUserReview
);

export const ReviewRoute = router;

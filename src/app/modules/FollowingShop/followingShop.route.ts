import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import {
  ImageFilesArrayZodSchema,
  ImageFileZodSchema,
} from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { FollowingShopController } from "./followingShop.controller";

const router = express.Router();

router.post(
  "/",
  // auth(UserRole.ADMIN),
  FollowingShopController.createFollowingShop
);

// router.get(
//   "/",
//   // auth(UserRole.ADMIN),
//   CategoryController.getAllCategories
// );

export const FollowingShopRoute = router;

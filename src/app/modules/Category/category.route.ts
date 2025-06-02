import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN),
  multerUpload.single("image"),
  parseBody,
  CategoryController.createCategory
);

router.get("/", CategoryController.getAllCategories);
router.get(
  "/single-category/:categoryId",
  CategoryController.getSingleCategory
);
router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoute = router;

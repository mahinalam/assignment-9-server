import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

router.get("/", CategoryController.getAllCategories);
router.get(
  "/single-category/:categoryId",
  CategoryController.getSingleCategory
);

export const CategoryRoute = router;

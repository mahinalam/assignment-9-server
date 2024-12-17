import express, { NextFunction, Request, Response } from "express";
// import { userController } from "./user.controller";
// import auth from "../../middlewares/auth";
// // import { UserRole } from '@prisma/client';
// import { fileUploader } from "../../../helpars/fileUploader";
// import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
// import { CategoryController } from "./category.controller";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import {
  ImageFilesArrayZodSchema,
  ImageFileZodSchema,
} from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import { OrderItemController } from "./orderItem.controller";

const router = express.Router();

router.post(
  "/",
  // auth(UserRole.ADMIN),
  OrderItemController.createOrderItem
);

router.get(
  "/",
  // auth(UserRole.ADMIN),
  OrderItemController.getAllOrderItem
);

export const OrderItemRoute = router;

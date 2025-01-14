import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { multerUpload } from "../../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFileZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get(
  "/",
  //  auth(UserRole.ADMIN),
  UserController.getAllUsers
);

// get single user
router.get(
  "/:id",
  // auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
  UserController.getSingleUser
);

router.post(
  "/",
  // auth(UserRole.ADMIN),
  UserController.createUser
  // fileUploader.upload.single('file'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   // req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
  //   return userController.createAdmin(req, res, next);
  // }
);

router.put(
  "/",
  // auth(UserRole.VENDOR),
  multerUpload.single("profilePhoto"),
  parseBody,
  UserController.updateMyProfile
);

export const UserRoutes = router;

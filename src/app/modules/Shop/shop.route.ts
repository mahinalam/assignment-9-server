import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ShopController } from "./shop.controller";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

// router.get("/", auth(UserRole.ADMIN), userController.getAllFromDB);

// router.get(
//   "/me",
//   auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
//   userController.getMyProfile
// );

router.post(
  "/",
  // auth(UserRole.VENDOR),
  multerUpload.single("logoImage"),
  parseBody,
  ShopController.createShop
);

router.post(
  "/",
  // auth(UserRole.ADMIN),
  ShopController.createShop
  // fileUploader.upload.single('file'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   // req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
  //   return userController.createAdmin(req, res, next);
  // }
);

router.get("/", auth(UserRole.VENDOR), ShopController.getVendorShop);
// // router.post(
//   "/create-vendor",
//   // auth(UserRole.ADMIN),
//   UserController.createVendor
//   // fileUploader.upload.single('file'),
//   // (req: Request, res: Response, next: NextFunction) => {
//   //   // req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
//   //   return userController.createAdmin(req, res, next);
//   // }
// );

// router.post(
//   "/create-customer",
//   // auth(UserRole.ADMIN),
//   UserController.createCustomer
//   // fileUploader.upload.single('file'),
//   // (req: Request, res: Response, next: NextFunction) => {
//   //   // req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
//   //   return userController.createAdmin(req, res, next);
//   // }
// );

export const ShopRoute = router;

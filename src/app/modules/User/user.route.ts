// import express from "express";
// import { UserRole } from "@prisma/client";
// import auth from "../../middlewares/auth";
// import { UserController } from "./user.controller";
// import { multerUpload } from "../../../config/multer.config";
// import { parseBody } from "../../middlewares/bodyParser";

// const router = express.Router();

// router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);

// router.get("/admin-stats", auth(UserRole.ADMIN), UserController.getAdminStats);
// router.get(
//   "/vendor-stats",
//   auth(UserRole.VENDOR),
//   UserController.getVendorStats
// );
// router.get("/user-stats", auth(UserRole.USER), UserController.getUserStats);
// // get single user
// router.get(
//   "/:id",
//   auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
//   UserController.getSingleUser
// );

// router.post("/", UserController.createUser);

// router.put(
//   "/",
//   auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
//   multerUpload.single("profilePhoto"),
//   parseBody,
//   UserController.updateMyProfile
// );

// router.delete("/:id", auth(UserRole.ADMIN), UserController.deleteUser);

// export const UserRoutes = router;

import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);

// router.get("/admin-stats", auth(UserRole.ADMIN), UserController.getAdminStats);
// router.get(
//   "/vendor-stats",
//   auth(UserRole.VENDOR),
//   UserController.getVendorStats
// );
// router.get("/user-stats", auth(UserRole.USER), UserController.getUserStats);
// // get single user
router.get(
  "/single-user",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  UserController.getSingleUser
);

router.post("/customer", UserController.createCustomer);
router.post("/vendor", UserController.createVendor);

router.put(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  multerUpload.single("profilePhoto"),
  parseBody,
  UserController.updateMyProfile
);

router.delete("/:id", auth(UserRole.ADMIN), UserController.deleteUser);

export const UserRoutes = router;

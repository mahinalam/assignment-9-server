"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const shop_controller_1 = require("./shop.controller");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
// router.get("/", auth(UserRole.ADMIN), userController.getAllFromDB);
// router.get(
//   "/me",
//   auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
//   userController.getMyProfile
// );
router.post("/", 
// auth(UserRole.VENDOR),
multer_config_1.multerUpload.single("logoImage"), bodyParser_1.parseBody, shop_controller_1.ShopController.createShop);
router.post("/", 
// auth(UserRole.ADMIN),
shop_controller_1.ShopController.createShop
// fileUploader.upload.single('file'),
// (req: Request, res: Response, next: NextFunction) => {
//   // req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
//   return userController.createAdmin(req, res, next);
// }
);
router.get("/", (0, auth_1.default)(client_1.UserRole.VENDOR), shop_controller_1.ShopController.getVendorShop);
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
exports.ShopRoute = router;

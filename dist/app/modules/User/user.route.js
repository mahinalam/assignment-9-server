"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAllUsers);
// // get single user
router.get("/single-user", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), user_controller_1.UserController.getSingleUser);
router.get("/user-stats", (0, auth_1.default)(client_1.UserRole.CUSTOMER), user_controller_1.UserController.getUserStats);
router.get("/vendor-stats", (0, auth_1.default)(client_1.UserRole.VENDOR), user_controller_1.UserController.getVendorStats);
router.get("/admin-stats", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAdminStats);
router.post("/customer", user_controller_1.UserController.createCustomer);
router.post("/vendor", multer_config_1.multerUpload.single("shopImage"), bodyParser_1.parseBody, user_controller_1.UserController.createVendor);
router.put("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), multer_config_1.multerUpload.single("profilePhoto"), bodyParser_1.parseBody, user_controller_1.UserController.updateMyProfile);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;

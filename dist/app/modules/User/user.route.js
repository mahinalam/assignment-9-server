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
router.get("/admin-stats", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAdminStats);
router.get("/vendor-stats", (0, auth_1.default)(client_1.UserRole.VENDOR), user_controller_1.UserController.getVendorStats);
router.get("/user-stats", (0, auth_1.default)(client_1.UserRole.USER), user_controller_1.UserController.getUserStats);
// get single user
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.USER), user_controller_1.UserController.getSingleUser);
router.post("/", user_controller_1.UserController.createUser);
router.put("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.USER), multer_config_1.multerUpload.single("profilePhoto"), bodyParser_1.parseBody, user_controller_1.UserController.updateMyProfile);
exports.UserRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const category_controller_1 = require("./category.controller");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, category_controller_1.CategoryController.createCategory);
router.get("/", category_controller_1.CategoryController.getAllCategories);
router.get("/single-category/:categoryId", category_controller_1.CategoryController.getSingleCategory);
router.delete("/:id", category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoute = router;

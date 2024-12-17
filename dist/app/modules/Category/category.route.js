"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.post("/", 
// auth(UserRole.ADMIN),
multer_config_1.multerUpload.single("categoryImage"), bodyParser_1.parseBody, category_controller_1.CategoryController.createCategory);
router.get("/", 
// auth(UserRole.ADMIN),
category_controller_1.CategoryController.getAllCategories);
exports.CategoryRoute = router;

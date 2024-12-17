"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const multer_config_1 = require("../../../config/multer.config");
const validateImageFileRequest_1 = __importDefault(require("../../middlewares/validateImageFileRequest"));
const image_validation_1 = require("../../zod/image.validation");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.get("/", 
// auth(UserRole.ADMIN),
product_controller_1.ProductController.getAllProducts);
router.get("/:id", 
// auth(UserRole.ADMIN),
product_controller_1.ProductController.getSingleProductFromDB);
router.post("/", 
// auth(UserRole.VENDOR),
multer_config_1.multerUpload.fields([{ name: "itemImages" }]), 
// multerUpload.fields([{ name: 'itemImages' }]),
(0, validateImageFileRequest_1.default)(image_validation_1.ImageFilesArrayZodSchema), bodyParser_1.parseBody, product_controller_1.ProductController.createProduct);
router.get("/vendor-products/:id", 
// auth(UserRole.ADMIN),
product_controller_1.ProductController.getAllVendorProducts);
router.patch("/:id", 
// auth(UserRole.ADMIN),
product_controller_1.ProductController.updateVendorShopProduct);
router.delete("/:id", 
// auth(UserRole.ADMIN),
product_controller_1.ProductController.deleteVendorShopProduct);
exports.ProductRoute = router;

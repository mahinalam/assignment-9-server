"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", product_controller_1.ProductController.getAllProducts);
router.get("/featured", product_controller_1.ProductController.getAllFeaturedProducts);
router.get("/flash", product_controller_1.ProductController.getAllFlashProducts);
//
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR), multer_config_1.multerUpload.fields([{ name: "itemImages" }]), 
// validateImageFileRequest(ImageFilesArrayZodSchema),
bodyParser_1.parseBody, product_controller_1.ProductController.createProduct);
router.put("/", (0, auth_1.default)(client_1.UserRole.VENDOR), multer_config_1.multerUpload.fields([{ name: "itemImages" }]), 
// validateImageFileRequest(ImageFilesArrayZodSchema),
bodyParser_1.parseBody, product_controller_1.ProductController.updateProductIntoDB);
router.get("/vendor-products/:id", product_controller_1.ProductController.getAllVendorProducts);
router.get("/single-product/:id", product_controller_1.ProductController.getSingleProductFromDB);
// router.patch(
//   "/:id",
//   auth(UserRole.ADMIN, UserRole.VENDOR),
//   ProductController.updateVendorShopProduct
// );
router.patch("/update-product", (0, auth_1.default)(client_1.UserRole.ADMIN), product_controller_1.ProductController.updateProductStatus);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), product_controller_1.ProductController.deleteVendorShopProduct);
exports.ProductRoute = router;

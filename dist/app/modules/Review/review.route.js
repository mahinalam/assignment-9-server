"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), review_controller_1.ReviewController.getAllReviews);
router.get("/vendor-products-reviews", (0, auth_1.default)(client_1.UserRole.VENDOR), review_controller_1.ReviewController.getVendorProductsReviews);
router.get("/user-reviews/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), review_controller_1.ReviewController.getUserProductReview);
router.get("/product/review", review_controller_1.ReviewController.getProductSpecificReviews);
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), multer_config_1.multerUpload.fields([{ name: "reviewImages" }]), 
// validateImageFileRequest(ImageFilesArrayZodSchema),
bodyParser_1.parseBody, review_controller_1.ReviewController.createReview);
router.post("/public", review_controller_1.ReviewController.createPublicReview);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER), review_controller_1.ReviewController.deleteUserReview);
exports.ReviewRoute = router;

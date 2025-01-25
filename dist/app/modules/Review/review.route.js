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
const validateImageFileRequest_1 = __importDefault(require("../../middlewares/validateImageFileRequest"));
const image_validation_1 = require("../../zod/image.validation");
const bodyParser_1 = require("../../middlewares/bodyParser");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.USER), multer_config_1.multerUpload.fields([{ name: "reviewImages" }]), (0, validateImageFileRequest_1.default)(image_validation_1.ImageFilesArrayZodSchema), bodyParser_1.parseBody, review_controller_1.ReviewController.createReview);
router.get("/vendor-products-reviews/:id", review_controller_1.ReviewController.getVendorProductsReviews);
router.get("/user-products-reviews/:id", review_controller_1.ReviewController.getUserProductReview);
router.get("/:id", review_controller_1.ReviewController.getProductSpecificReviews);
exports.ReviewRoute = router;

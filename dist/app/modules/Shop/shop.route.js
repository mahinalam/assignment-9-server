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
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR), multer_config_1.multerUpload.single("logoImage"), bodyParser_1.parseBody, shop_controller_1.ShopController.createShop);
router.post("/follow-shop", (0, auth_1.default)(client_1.UserRole.USER), shop_controller_1.ShopController.followShop);
router.get("/", shop_controller_1.ShopController.getAllShop);
router.get("/vendor-shop", shop_controller_1.ShopController.getVendorShop);
exports.ShopRoute = router;

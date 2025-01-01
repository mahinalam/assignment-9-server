"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowingShopRoute = void 0;
const express_1 = __importDefault(require("express"));
const followingShop_controller_1 = require("./followingShop.controller");
const router = express_1.default.Router();
router.post("/", 
// auth(UserRole.ADMIN),
followingShop_controller_1.FollowingShopController.followShop);
// router.get(
//   "/",
//   // auth(UserRole.ADMIN),
//   CategoryController.getAllCategories
// );
exports.FollowingShopRoute = router;

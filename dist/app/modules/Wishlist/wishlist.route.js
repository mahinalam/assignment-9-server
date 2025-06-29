"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const wishlist_controller_1 = require("../Wishlist/wishlist.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), wishlist_controller_1.WishlistController.getUsersWishlists);
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), wishlist_controller_1.WishlistController.createWishlist);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER), wishlist_controller_1.WishlistController.removeFromWishlist);
exports.WishlistRoute = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const category_route_1 = require("../modules/Category/category.route");
const shop_route_1 = require("../modules/Shop/shop.route");
const product_route_1 = require("../modules/Product/product.route");
const review_route_1 = require("../modules/Review/review.route");
const order_route_1 = require("../modules/Order/order.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const coupon_route_1 = require("../modules/Coupon/coupon.route");
const cart_route_1 = require("../modules/Cart/cart.route");
const wishlist_route_1 = require("../modules/Wishlist/wishlist.route");
const contact_route_1 = require("../modules/Contact/contact.route");
const compare_route_1 = require("../modules/Compare/compare.route");
const newsLetter_route_1 = require("../modules/NewsLetter/newsLetter.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoute,
    },
    {
        path: "/shop",
        route: shop_route_1.ShopRoute,
    },
    {
        path: "/product",
        route: product_route_1.ProductRoute,
    },
    {
        path: "/order",
        route: order_route_1.OrderRoute,
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoute,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoute,
    },
    {
        path: "/coupon",
        route: coupon_route_1.CouponRoute,
    },
    {
        path: "/cart",
        route: cart_route_1.CartRoute,
    },
    {
        path: "/wishlist",
        route: wishlist_route_1.WishlistRoute,
    },
    {
        path: "/contact",
        route: contact_route_1.ContactRoute,
    },
    {
        path: "/compare",
        route: compare_route_1.CompareRoute,
    },
    {
        path: "/news-letter",
        route: newsLetter_route_1.NewsLetterRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

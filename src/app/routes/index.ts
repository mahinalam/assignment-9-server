import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoute } from "../modules/Auth/auth.route";
import { CategoryRoute } from "../modules/Category/category.route";
import { ShopRoute } from "../modules/Shop/shop.route";
import { ProductRoute } from "../modules/Product/product.route";
import { ReviewRoute } from "../modules/Review/review.route";
import { OrderRoute } from "../modules/Order/order.route";
import { PaymentRoute } from "../modules/Payment/payment.route";
import { FollowingShopRoute } from "../modules/FollowingShop/followingShop.route";
import { BrandRoute } from "../modules/Brand/brand.route";
import { CouponRoute } from "../modules/Coupon/coupon.route";
import { CartRoute } from "../modules/Cart/cart.route";
import { WishlistRoute } from "../modules/Wishlist/wishlist.route";
import { ContactRoute } from "../modules/Contact/contact.route";
import { CompareRoute } from "../modules/Compare/compare.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/category",
    route: CategoryRoute,
  },
  {
    path: "/shop",
    route: ShopRoute,
  },
  {
    path: "/product",
    route: ProductRoute,
  },
  {
    path: "/order",
    route: OrderRoute,
  },
  {
    path: "/review",
    route: ReviewRoute,
  },
  {
    path: "/payment",
    route: PaymentRoute,
  },
  {
    path: "/brand",
    route: BrandRoute,
  },
  {
    path: "/coupon",
    route: CouponRoute,
  },
  {
    path: "/cart",
    route: CartRoute,
  },
  {
    path: "/wishlist",
    route: WishlistRoute,
  },
  {
    path: "/contact",
    route: ContactRoute,
  },
  {
    path: "/compare",
    route: CompareRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

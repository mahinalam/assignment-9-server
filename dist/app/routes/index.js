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
const followingShop_route_1 = require("../modules/FollowingShop/followingShop.route");
const brand_route_1 = require("../modules/Brand/brand.route");
// import { userRoutes } from "../modules/User/user.routes";
// import { AdminRoutes } from "../modules/Admin/admin.routes";
// import { AuthRoutes } from "../modules/Auth/auth.routes";
// import { SpecialtiesRoutes } from "../modules/Specialties/specialties.routes";
// import { DoctorRoutes } from "../modules/Doctor/doctor.routes";
// import { PatientRoutes } from "../modules/Patient/patient.route";
// import { ScheduleRoutes } from "../modules/Schedule/schedule.routes";
// import { DoctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.routes";
// import { AppointmentRoutes } from "../modules/Appointment/appointment.routes";
// import { PaymentRoutes } from "../modules/Payment/payment.routes";
// import { PrescriptionRoutes } from "../modules/Prescription/prescription.routes";
// import { ReviewRoutes } from "../modules/Review/review.routes";
// import { MetaRoutes } from "../modules/Meta/meta.routes";
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
        path: "/following-shop",
        route: followingShop_route_1.FollowingShopRoute,
    },
    {
        path: "/brand",
        route: brand_route_1.BrandRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

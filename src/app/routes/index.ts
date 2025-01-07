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
    path: "/following-shop",
    route: FollowingShopRoute,
  },
  {
    path: "/brand",
    route: BrandRoute,
  },
  {
    path: "/coupon",
    route: CouponRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

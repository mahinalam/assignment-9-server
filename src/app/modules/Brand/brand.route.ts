import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { BrandController } from "./brand.controller";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), BrandController.createBarnd);

router.get("/", BrandController.getAllBarnd);

export const BrandRoute = router;

import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { CompareController } from "./compare.controller";

const router = express.Router();

router.get("/", auth(UserRole.CUSTOMER), CompareController.getUsersCompare);
router.post("/", auth(UserRole.CUSTOMER), CompareController.createCompare);

router.delete("/:id", auth(UserRole.CUSTOMER), CompareController.deleteCompare);

export const CompareRoute = router;

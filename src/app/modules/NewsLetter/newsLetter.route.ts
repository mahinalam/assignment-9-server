import express from "express";
import { NewsLetterController } from "./newsLetter.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get("/", auth(UserRole.CUSTOMER), NewsLetterController.getNewsLetter);
router.post("/", NewsLetterController.createNewsLetter);
export const NewsLetterRoute = router;

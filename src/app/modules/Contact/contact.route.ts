import express from "express";
import { ContactController } from "./contact.controller";
const router = express.Router();

router.post("/", ContactController.sendMessage);
export const ContactRoute = router;

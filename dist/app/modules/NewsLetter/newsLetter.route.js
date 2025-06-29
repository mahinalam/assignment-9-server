"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterRoute = void 0;
const express_1 = __importDefault(require("express"));
const newsLetter_controller_1 = require("./newsLetter.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), newsLetter_controller_1.NewsLetterController.getNewsLetter);
router.post("/", newsLetter_controller_1.NewsLetterController.createNewsLetter);
exports.NewsLetterRoute = router;

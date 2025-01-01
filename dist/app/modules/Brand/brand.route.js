"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoute = void 0;
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("./brand.controller");
const router = express_1.default.Router();
router.post("/", brand_controller_1.BrandController.createBarnd);
router.get("/", 
// auth(UserRole.ADMIN),
brand_controller_1.BrandController.getAllBarnd);
exports.BrandRoute = router;

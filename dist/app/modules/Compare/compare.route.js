"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const compare_controller_1 = require("./compare.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), compare_controller_1.CompareController.getUsersCompare);
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), compare_controller_1.CompareController.createCompare);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER), compare_controller_1.CompareController.deleteCompare);
exports.CompareRoute = router;

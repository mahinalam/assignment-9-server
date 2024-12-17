"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/", 
//  auth(UserRole.ADMIN),
user_controller_1.UserController.getAllUsers);
// get single user
router.get("/:id", 
// auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.USER),
user_controller_1.UserController.getSingleUser);
router.post("/", 
// auth(UserRole.ADMIN),
user_controller_1.UserController.createUser
// fileUploader.upload.single('file'),
// (req: Request, res: Response, next: NextFunction) => {
//   // req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
//   return userController.createAdmin(req, res, next);
// }
);
exports.UserRoutes = router;

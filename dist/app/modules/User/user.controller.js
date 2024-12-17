"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const user_service_1 = require("./user.service");
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsersFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.getSingleUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User retrieved successfully",
        data: result,
    });
}));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createUserIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User Created successfuly!",
        data: result,
    });
}));
// const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
//   // console.log(req.query)
//   const filters = pick(req.query, userFilterableFields);
//   const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
//   const result = await userService.getAllFromDB(filters, options);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Users data fetched!",
//     meta: result.meta,
//     data: result.data,
//   });
// });
// const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await userService.changeProfileStatus(id, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Users profile status changed!",
//     data: result,
//   });
// });
// const getMyProfile = catchAsync(
//   async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const user = req.user;
//     const result = await userService.getMyProfile(user as IAuthUser);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "My profile data fetched!",
//       data: result,
//     });
//   }
// );
// const updateMyProfie = catchAsync(
//   async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const user = req.user;
//     const result = await userService.updateMyProfie(user as IAuthUser, req);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "My profile updated!",
//       data: result,
//     });
//   }
// );
exports.UserController = {
    getAllUsers,
    createUser,
    getSingleUser,
    // changeProfileStatus,
    // getMyProfile,
    // updateMyProfie
};

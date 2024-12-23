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
exports.FollowingShopController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const followingShop_service_1 = require("./followingShop.service");
const createFollowingShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield followingShop_service_1.FollowingShopService.createFollowingShopIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Successfully Followed Shop!",
        data: result,
    });
}));
// const getAllCategories = catchAsync(async (req, res) => {
//   const categories = await CategoryService.getAllCategoriesFromDB();
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Categories retrieved successfully",
//     data: categories,
//   });
// });
exports.FollowingShopController = {
    createFollowingShop,
    //   getAllCategories,
    //   createCustomer,
    // getAllFromDB,
    // changeProfileStatus,
    // getMyProfile,
    // updateMyProfie
};

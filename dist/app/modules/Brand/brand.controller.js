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
exports.BrandController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const brand_service_1 = require("./brand.service");
const createBarnd = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.BrandService.createBrandIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Brand Created successfuly!",
        data: result,
    });
}));
const getAllBarnd = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield brand_service_1.BrandService.getAllBrandFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Brands retrieved successfully",
        data: categories,
    });
}));
exports.BrandController = {
    createBarnd,
    getAllBarnd,
    //   createCustomer,
    // getAllFromDB,
    // changeProfileStatus,
    // getMyProfile,
    // updateMyProfie
};

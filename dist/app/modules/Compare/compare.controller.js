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
exports.CompareController = void 0;
const catchAsync_1 = __importDefault(require("../../../sharred/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../sharred/sendResponse"));
const compare_service_1 = require("./compare.service");
const getUsersCompare = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const compareProducts = yield compare_service_1.CompareService.getUsersCompareProduct(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Compare products retrieved successfully",
        data: compareProducts,
    });
}));
const createCompare = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const { userId } = req.user;
    const result = yield compare_service_1.CompareService.createCompareIntoDB(userId, productId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Compare Created successfuly!",
        data: result,
    });
}));
// delete category
const deleteCompare = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.user;
    const result = yield compare_service_1.CompareService.removeCompareProduct(userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Compare Item deleted successfuly!",
        data: result,
    });
}));
exports.CompareController = {
    createCompare,
    getUsersCompare,
    deleteCompare,
};

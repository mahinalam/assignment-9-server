"use strict";
// model OrderItem {
//     id        String   @id @default(uuid())
//     quantity  Int
//     price     Float
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     isDeleted Boolean  @default(false)
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
exports.OrderItemService = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const createOrderItemIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orderItem.create({
        data: payload,
    });
    return result;
});
const getOrderItemsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orderItem.findMany();
    return result;
});
exports.OrderItemService = {
    createOrderItemIntoDB,
    getOrderItemsFromDB,
    //   getAllCategoriesFromDB,
    //   createCustomer,
};

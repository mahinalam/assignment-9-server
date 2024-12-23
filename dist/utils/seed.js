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
exports.seed = void 0;
/* eslint-disable no-console */
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../sharred/prisma"));
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //atfirst check if the admin exist of not
        const admin = yield prisma_1.default.user.findFirst({
            where: {
                role: client_1.UserRole.ADMIN,
                email: config_1.default.admin_email,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        if (!admin) {
            console.log("Seeding started...");
            yield prisma_1.default.user.create({
                data: {
                    name: "Mahin",
                    role: client_1.UserRole.ADMIN,
                    email: config_1.default.admin_email,
                    password: config_1.default.admin_password,
                    address: "Dhamrai, Dhaka",
                    phoneNumber: "0123456789",
                    status: client_1.UserStatus.ACTIVE,
                },
            });
            console.log("Admin created successfully...");
            console.log("Seeding completed...");
        }
    }
    catch (error) {
        console.log("Error in seeding", error);
    }
});
exports.seed = seed;

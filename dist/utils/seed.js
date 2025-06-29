"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcrypt"));
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield prisma_1.default.user.findFirst({
            where: {
                role: client_1.UserRole.ADMIN,
                email: config_1.default.admin_email,
            },
        });
        if (!admin) {
            yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                //atfirst check if the admin exist of not
                console.log("Seeding started...");
                const hashedPassword = yield bcrypt.hash(config_1.default.admin_password, 12);
                const adminData = yield tx.user.create({
                    data: {
                        role: client_1.UserRole.ADMIN,
                        email: config_1.default.admin_email,
                        password: hashedPassword,
                    },
                });
                yield tx.admin.create({
                    data: {
                        userId: adminData.id,
                        email: adminData.email,
                        gender: "MALE",
                        name: "Mahin",
                        address: "Dhamrai, Dhaka",
                        phoneNumber: "0123456789",
                    },
                });
                console.log("Admin created successfully...");
                console.log("Seeding completed...");
            }));
        }
    }
    catch (error) {
        console.log("Error in seeding", error);
    }
});
exports.seed = seed;

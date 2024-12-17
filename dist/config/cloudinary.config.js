"use strict";
// import { v2 as cloudinary } from "cloudinary";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = void 0;
// cloudinary.config({
//   cloud_name: "dbgrq28js",
//   api_key: "173484379744282",
//   api_secret: "eHKsVTxIOLl5oaO_BHxBQWAK3GA",
// });
// export const cloudinaryUpload = cloudinary;
const cloudinary_1 = require("cloudinary");
const _1 = __importDefault(require("."));
cloudinary_1.v2.config({
    cloud_name: _1.default.cloudinary_cloud_name,
    api_key: _1.default.cloudinary_api_key,
    api_secret: _1.default.cloudinary_api_secret,
});
exports.cloudinaryUpload = cloudinary_1.v2;

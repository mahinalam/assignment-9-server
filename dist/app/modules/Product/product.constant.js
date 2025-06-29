"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorProductFilterableFields = exports.productFilterableFields = exports.vendorProductSearchAbleFields = exports.productSearchAbleFields = void 0;
exports.productSearchAbleFields = [
    "name",
    "shortDescription",
    "longDescription",
];
exports.vendorProductSearchAbleFields = ["name", "description"];
exports.productFilterableFields = [
    "searchTerm",
    "rating",
    "priceMax",
    "priceMin",
    "brandId",
    "categoryId",
    "stock",
];
exports.vendorProductFilterableFields = ["searchTerm", "shopId"];

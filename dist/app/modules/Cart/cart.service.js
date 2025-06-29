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
exports.CartService = exports.removeCartItem = exports.clearCart = exports.addToCart = void 0;
const prisma_1 = __importDefault(require("../../../sharred/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const addToCart = (customerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId, productId, price, quantity = 1 } = payload;
    console.log({ shopId, productId, price });
    // check is the customer exists
    const isCustomerExists = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            userId: customerId,
            isDeleted: false,
        },
    });
    // check is the shop exists
    yield prisma_1.default.shop.findFirstOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    // check is the product exists
    yield prisma_1.default.product.findFirstOrThrow({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    // Check if the cart already exists for the customer
    let cart = yield prisma_1.default.cart.findFirst({
        where: { customerId: isCustomerExists.id, isDeleted: false },
        include: { cartItem: true },
    });
    console.log({ cart });
    if (!cart) {
        // Create a new cart if it doesn't exist
        cart = yield prisma_1.default.cart.create({
            data: {
                customerId: isCustomerExists.id,
                shopId,
                cartItem: {
                    create: {
                        productId,
                        price,
                        quantity,
                    },
                },
            },
            include: { cartItem: true },
        });
    }
    else {
        // check if shopid exist  the cart
        if (cart.shopId !== shopId) {
            throw new Error("You can only add products from one vendor at a time. Please complete or clear your current cart to proceed.");
        }
        // Check if the product is already in the cart
        const existingCartItem = cart.cartItem.find((item) => item.productId === productId);
        if (existingCartItem) {
            // If the product is already in the cart, update the quantity
            const newQuantity = existingCartItem.quantity + quantity;
            if (newQuantity <= 0) {
                throw new Error("Quantity cannot be zero or negative");
            }
            yield prisma_1.default.cartItem.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: newQuantity,
                },
            });
        }
        else {
            // If the product is not in the cart, add it with the specified quantity (default is 1)
            yield prisma_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    price,
                    quantity,
                },
            });
        }
    }
    // Return the updated cart after the operation
    return cart;
});
exports.addToCart = addToCart;
const clearCart = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ customerId });
    // Find the customer's cart
    const cart = yield prisma_1.default.cart.findUnique({
        where: { customerId },
        include: { cartItem: true },
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete all items from the cart
        yield tx.cartItem.deleteMany({
            where: { cartId: cart.id, isDeleted: false },
        });
        const result = yield tx.cart.delete({
            where: { customerId, isDeleted: false },
        });
        return result;
    }));
    // Optionally, you can also delete the cart itself if needed
    // await prisma.cart.delete({ where: { customerId } });
    return { message: "Cart cleared successfully" };
});
exports.clearCart = clearCart;
// Remove a specific cart item
const removeCartItem = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Find the cart item
        const cartItem = yield tx.cartItem.findFirst({
            where: { id: cartItemId, isDeleted: false },
        });
        if (!cartItem) {
            throw new ApiError_1.default(404, "Cart item not found");
        }
        const cartId = cartItem.cartId;
        // 2. Soft delete the cart item
        yield tx.cartItem.delete({
            where: { id: cartItemId, isDeleted: false },
        });
        // 3. Count remaining active items in the cart
        const remainingItemCount = yield tx.cartItem.count({
            where: {
                cartId,
                isDeleted: false,
            },
        });
        console.log({ remainingItemCount });
        // 4. If none left, soft-delete the cart too
        if (remainingItemCount === 0) {
            yield tx.cart.delete({
                where: { id: cartId, isDeleted: false },
            });
            return {
                message: "Cart item and its parent cart removed successfully",
            };
        }
        return { message: "Cart item removed successfully" };
    }));
});
exports.removeCartItem = removeCartItem;
// Get user's specific cart with total quantity and total price
const getUserCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check is the customer exists
    const isCustomerExists = yield prisma_1.default.customer.findFirstOrThrow({
        where: {
            userId,
            isDeleted: false,
        },
    });
    if (!isCustomerExists) {
        return {
            cart: null,
            cartItems: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    }
    // Fetch the cart along with its items
    const cart = yield prisma_1.default.cart.findUnique({
        where: { customerId: isCustomerExists.id, isDeleted: false },
        include: {
            cartItem: {
                where: {
                    isDeleted: false,
                },
                include: {
                    product: true, // Include product details if needed
                },
            },
        },
    });
    if (!cart || cart.cartItem.length === 0) {
        // No cart or no items — return empty cart info
        return {
            cart: null,
            cartItems: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    }
    // Calculate total quantity and total price
    const totalQuantity = cart.cartItem.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.cartItem.reduce((sum, item) => sum + item.quantity * item.price, 0);
    // Return the cart details along with totals
    return {
        cartId: cart.id,
        customerId: cart.customerId,
        shopId: cart.shopId,
        cartItems: cart.cartItem,
        totalQuantity,
        totalPrice,
    };
});
exports.CartService = {
    addToCart: exports.addToCart,
    removeCartItem: exports.removeCartItem,
    clearCart: exports.clearCart,
    getUserCart,
};

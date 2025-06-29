import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

export const addToCart = async (
  customerId: string,
  payload: {
    shopId: string;
    productId: string;
    price: number;
    quantity: number;
  }
) => {
  const { shopId, productId, price, quantity = 1 } = payload;
  console.log({ shopId, productId, price });

  // check is the customer exists
  const isCustomerExists = await prisma.customer.findFirstOrThrow({
    where: {
      userId: customerId,
      isDeleted: false,
    },
  });
  // check is the shop exists
  await prisma.shop.findFirstOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
  });
  // check is the product exists
  await prisma.product.findFirstOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  // Check if the cart already exists for the customer
  let cart = await prisma.cart.findFirst({
    where: { customerId: isCustomerExists.id, isDeleted: false },
    include: { cartItem: true },
  });

  console.log({ cart });

  if (!cart) {
    // Create a new cart if it doesn't exist
    cart = await prisma.cart.create({
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
  } else {
    // check if shopid exist  the cart

    if (cart.shopId !== shopId) {
      throw new Error(
        "You can only add products from one vendor at a time. Please complete or clear your current cart to proceed."
      );
    }

    // Check if the product is already in the cart
    const existingCartItem = cart.cartItem.find(
      (item) => item.productId === productId
    );

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity <= 0) {
        throw new Error("Quantity cannot be zero or negative");
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      // If the product is not in the cart, add it with the specified quantity (default is 1)
      await prisma.cartItem.create({
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
};

export const clearCart = async (customerId: string) => {
  console.log({ customerId });
  // Find the customer's cart
  const cart = await prisma.cart.findUnique({
    where: { customerId },
    include: { cartItem: true },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await prisma.$transaction(async (tx) => {
    // Delete all items from the cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id, isDeleted: false },
    });
    const result = await tx.cart.delete({
      where: { customerId, isDeleted: false },
    });
    return result;
  });

  // Optionally, you can also delete the cart itself if needed
  // await prisma.cart.delete({ where: { customerId } });

  return { message: "Cart cleared successfully" };
};

// Remove a specific cart item
export const removeCartItem = async (cartItemId: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the cart item
    const cartItem = await tx.cartItem.findFirst({
      where: { id: cartItemId, isDeleted: false },
    });

    if (!cartItem) {
      throw new ApiError(404, "Cart item not found");
    }

    const cartId = cartItem.cartId;

    // 2. Soft delete the cart item
    await tx.cartItem.delete({
      where: { id: cartItemId, isDeleted: false },
    });

    // 3. Count remaining active items in the cart
    const remainingItemCount = await tx.cartItem.count({
      where: {
        cartId,
        isDeleted: false,
      },
    });

    console.log({ remainingItemCount });
    // 4. If none left, soft-delete the cart too
    if (remainingItemCount === 0) {
      await tx.cart.delete({
        where: { id: cartId, isDeleted: false },
      });

      return {
        message: "Cart item and its parent cart removed successfully",
      };
    }

    return { message: "Cart item removed successfully" };
  });
};

// Get user's specific cart with total quantity and total price
const getUserCart = async (userId: string) => {
  // check is the customer exists
  const isCustomerExists = await prisma.customer.findFirstOrThrow({
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
  const cart = await prisma.cart.findUnique({
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
  const totalQuantity = cart.cartItem.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = cart.cartItem.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Return the cart details along with totals
  return {
    cartId: cart.id,
    customerId: cart.customerId,
    shopId: cart.shopId,
    cartItems: cart.cartItem,
    totalQuantity,
    totalPrice,
  };
};

export const CartService = {
  addToCart,
  removeCartItem,
  clearCart,
  getUserCart,
};

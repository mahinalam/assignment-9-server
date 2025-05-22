/*
  Warnings:

  - You are about to drop the `AddToWishlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AddToWishlistItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AddToWishlist" DROP CONSTRAINT "AddToWishlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "AddToWishlistItem" DROP CONSTRAINT "AddToWishlistItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "AddToWishlistItem" DROP CONSTRAINT "AddToWishlistItem_wishListId_fkey";

-- DropTable
DROP TABLE "AddToWishlist";

-- DropTable
DROP TABLE "AddToWishlistItem";

-- CreateTable
CREATE TABLE "wish_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wish_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wish_list_items" (
    "wishListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "wish_lists_userId_key" ON "wish_lists"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wish_list_items_wishListId_key" ON "wish_list_items"("wishListId");

-- AddForeignKey
ALTER TABLE "wish_lists" ADD CONSTRAINT "wish_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wish_list_items" ADD CONSTRAINT "wish_list_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wish_list_items" ADD CONSTRAINT "wish_list_items_wishListId_fkey" FOREIGN KEY ("wishListId") REFERENCES "wish_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

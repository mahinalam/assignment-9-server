/*
  Warnings:

  - Added the required column `updatedAt` to the `AddToWishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AddToWishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AddToWishlist" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AddToWishlistItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - The primary key for the `compare` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `compare` table. All the data in the column will be lost.
  - The primary key for the `wish_lists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `wish_lists` table. All the data in the column will be lost.
  - You are about to drop the `compare_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wish_list_items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `compare` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `wish_lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "compare_item" DROP CONSTRAINT "compare_item_compareId_fkey";

-- DropForeignKey
ALTER TABLE "compare_item" DROP CONSTRAINT "compare_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "wish_list_items" DROP CONSTRAINT "wish_list_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "wish_list_items" DROP CONSTRAINT "wish_list_items_wishlistId_fkey";

-- AlterTable
ALTER TABLE "compare" DROP CONSTRAINT "compare_pkey",
DROP COLUMN "id",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD CONSTRAINT "compare_pkey" PRIMARY KEY ("userId", "productId");

-- AlterTable
ALTER TABLE "wish_lists" DROP CONSTRAINT "wish_lists_pkey",
DROP COLUMN "id",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD CONSTRAINT "wish_lists_pkey" PRIMARY KEY ("userId", "productId");

-- DropTable
DROP TABLE "compare_item";

-- DropTable
DROP TABLE "wish_list_items";

-- AddForeignKey
ALTER TABLE "wish_lists" ADD CONSTRAINT "wish_lists_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare" ADD CONSTRAINT "compare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare" ADD CONSTRAINT "compare_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

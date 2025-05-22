/*
  Warnings:

  - You are about to drop the column `wishListId` on the `wish_list_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wishlistId]` on the table `wish_list_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wishlistId` to the `wish_list_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "wish_list_items" DROP CONSTRAINT "wish_list_items_wishListId_fkey";

-- DropIndex
DROP INDEX "wish_list_items_wishListId_key";

-- AlterTable
ALTER TABLE "wish_list_items" DROP COLUMN "wishListId",
ADD COLUMN     "wishlistId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wish_list_items_wishlistId_key" ON "wish_list_items"("wishlistId");

-- AddForeignKey
ALTER TABLE "wish_list_items" ADD CONSTRAINT "wish_list_items_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "wish_lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

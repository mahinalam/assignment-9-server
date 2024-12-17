/*
  Warnings:

  - You are about to drop the column `shopId` on the `vendors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorId]` on the table `shops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_shopId_fkey";

-- DropIndex
DROP INDEX "vendors_shopId_key";

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "shopId";

-- CreateIndex
CREATE UNIQUE INDEX "shops_vendorId_key" ON "shops"("vendorId");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

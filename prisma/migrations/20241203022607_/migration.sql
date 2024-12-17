/*
  Warnings:

  - You are about to drop the column `vendorId` on the `shops` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorEmail]` on the table `shops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorEmail` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT "shops_vendorId_fkey";

-- DropIndex
DROP INDEX "shops_vendorId_key";

-- AlterTable
ALTER TABLE "shops" DROP COLUMN "vendorId",
ADD COLUMN     "vendorEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shops_vendorEmail_key" ON "shops"("vendorEmail");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_vendorEmail_fkey" FOREIGN KEY ("vendorEmail") REFERENCES "vendors"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `compare` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `compare` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `compare` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `compare` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "compare" DROP CONSTRAINT "compare_pkey",
DROP COLUMN "productId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "compare_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "compare_item" (
    "compareId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "compare_item_pkey" PRIMARY KEY ("compareId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "compare_userId_key" ON "compare"("userId");

-- AddForeignKey
ALTER TABLE "compare_item" ADD CONSTRAINT "compare_item_compareId_fkey" FOREIGN KEY ("compareId") REFERENCES "compare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compare_item" ADD CONSTRAINT "compare_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

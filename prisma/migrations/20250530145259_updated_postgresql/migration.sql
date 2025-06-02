/*
  Warnings:

  - You are about to drop the column `brandId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `longDescription` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_brandId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brandId",
DROP COLUMN "description",
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "longDescription" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT;

-- DropTable
DROP TABLE "brands";

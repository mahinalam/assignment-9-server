/*
  Warnings:

  - You are about to drop the column `maxUsage` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `minPurchase` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "maxUsage",
DROP COLUMN "minPurchase",
DROP COLUMN "usageCount";

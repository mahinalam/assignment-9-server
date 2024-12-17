/*
  Warnings:

  - Added the required column `transactionId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "method" SET DEFAULT 'CASH_ON_DELIVERY';

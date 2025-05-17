/*
  Warnings:

  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('CART', 'BUY_NOW');

-- DropIndex
DROP INDEX "Order_customerEmail_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "source" "OrderSource" NOT NULL DEFAULT 'CART';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" TEXT NOT NULL;

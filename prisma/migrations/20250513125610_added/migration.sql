/*
  Warnings:

  - You are about to drop the column `logoImage` on the `shops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shops" DROP COLUMN "logoImage",
ADD COLUMN     "logo" TEXT;

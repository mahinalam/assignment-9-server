/*
  Warnings:

  - You are about to drop the column `logo` on the `shops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shops" DROP COLUMN "logo",
ADD COLUMN     "logoImage" TEXT;

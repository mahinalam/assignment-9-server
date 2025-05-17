/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `shops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shops" DROP COLUMN "imageUrl",
ADD COLUMN     "logoImage" TEXT;

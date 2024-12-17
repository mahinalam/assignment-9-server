/*
  Warnings:

  - You are about to drop the column `authorId` on the `shops` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "shops_authorId_key";

-- AlterTable
ALTER TABLE "shops" DROP COLUMN "authorId";

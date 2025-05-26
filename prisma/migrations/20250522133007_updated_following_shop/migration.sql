/*
  Warnings:

  - The primary key for the `following_shops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `following_shops` table. All the data in the column will be lost.
  - Added the required column `userId` to the `following_shops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "following_shops" DROP CONSTRAINT "following_shops_customerId_fkey";

-- AlterTable
ALTER TABLE "following_shops" DROP CONSTRAINT "following_shops_pkey",
DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "following_shops_pkey" PRIMARY KEY ("userId", "shopId");

-- AddForeignKey
ALTER TABLE "following_shops" ADD CONSTRAINT "following_shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

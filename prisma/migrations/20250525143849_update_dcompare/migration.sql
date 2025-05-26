/*
  Warnings:

  - You are about to drop the `Compare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Compare";

-- CreateTable
CREATE TABLE "compare" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "compare_pkey" PRIMARY KEY ("userId","productId")
);

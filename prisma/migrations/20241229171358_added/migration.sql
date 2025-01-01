/*
  Warnings:

  - The primary key for the `brands` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "brands" DROP CONSTRAINT "brands_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "brands_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "brands_id_seq";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brandId" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

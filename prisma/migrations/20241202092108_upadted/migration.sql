-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_shopId_fkey";

-- AlterTable
ALTER TABLE "vendors" ALTER COLUMN "shopId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

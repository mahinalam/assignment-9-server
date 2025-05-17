-- AlterTable
ALTER TABLE "products" ADD COLUMN     "discountPrice" INTEGER,
ALTER COLUMN "discount" DROP NOT NULL;

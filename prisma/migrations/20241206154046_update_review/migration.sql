-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

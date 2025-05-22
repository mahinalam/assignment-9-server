-- DropIndex
DROP INDEX "wish_list_items_wishlistId_key";

-- AlterTable
ALTER TABLE "wish_list_items" ADD CONSTRAINT "wish_list_items_pkey" PRIMARY KEY ("wishlistId", "productId");

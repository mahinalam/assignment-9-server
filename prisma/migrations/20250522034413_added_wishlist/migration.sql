-- CreateTable
CREATE TABLE "AddToWishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AddToWishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddToWishlistItem" (
    "wishListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AddToWishlist_userId_key" ON "AddToWishlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AddToWishlistItem_wishListId_key" ON "AddToWishlistItem"("wishListId");

-- AddForeignKey
ALTER TABLE "AddToWishlist" ADD CONSTRAINT "AddToWishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddToWishlistItem" ADD CONSTRAINT "AddToWishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddToWishlistItem" ADD CONSTRAINT "AddToWishlistItem_wishListId_fkey" FOREIGN KEY ("wishListId") REFERENCES "AddToWishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

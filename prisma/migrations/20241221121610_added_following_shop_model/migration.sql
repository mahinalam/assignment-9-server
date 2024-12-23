-- CreateTable
CREATE TABLE "following_shops" (
    "followerId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "following_shops_pkey" PRIMARY KEY ("followerId","shopId")
);

-- AddForeignKey
ALTER TABLE "following_shops" ADD CONSTRAINT "following_shops_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following_shops" ADD CONSTRAINT "following_shops_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Compare" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Compare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Compare_productId_key" ON "Compare"("productId");

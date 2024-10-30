-- CreateTable
CREATE TABLE "ItemPrices" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,
    "ivaPercentage" DECIMAL(65,30),
    "priceWithIva" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "levelId" INTEGER,

    CONSTRAINT "ItemPrices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemPrices_classId_itemName_key" ON "ItemPrices"("classId", "itemName");

-- AddForeignKey
ALTER TABLE "ItemPrices" ADD CONSTRAINT "ItemPrices_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

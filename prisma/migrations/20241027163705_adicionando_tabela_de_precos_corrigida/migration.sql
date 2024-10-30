/*
  Warnings:

  - You are about to drop the `ItemPrices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemPrices" DROP CONSTRAINT "ItemPrices_levelId_fkey";

-- DropTable
DROP TABLE "ItemPrices";

-- CreateTable
CREATE TABLE "item_prices" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,
    "ivaPercentage" DECIMAL(65,30),
    "priceWithIva" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "levelId" INTEGER,

    CONSTRAINT "item_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_prices_classId_itemName_key" ON "item_prices"("classId", "itemName");

-- AddForeignKey
ALTER TABLE "item_prices" ADD CONSTRAINT "item_prices_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

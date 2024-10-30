/*
  Warnings:

  - You are about to drop the column `classId` on the `item_prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[levelId,itemName]` on the table `item_prices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "item_prices_classId_itemName_key";

-- AlterTable
ALTER TABLE "item_prices" DROP COLUMN "classId";

-- CreateIndex
CREATE UNIQUE INDEX "item_prices_levelId_itemName_key" ON "item_prices"("levelId", "itemName");

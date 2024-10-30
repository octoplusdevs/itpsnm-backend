/*
  Warnings:

  - You are about to alter the column `ivaPercentage` on the `item_prices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "item_prices" ALTER COLUMN "ivaPercentage" SET DATA TYPE INTEGER;

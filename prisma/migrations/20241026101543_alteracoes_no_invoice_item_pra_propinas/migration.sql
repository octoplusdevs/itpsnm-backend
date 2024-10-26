/*
  Warnings:

  - Added the required column `QTY` to the `invoice_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `invoice_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvoiceType" ADD VALUE 'Propinas';
ALTER TYPE "InvoiceType" ADD VALUE 'Multa de Propinas';

-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "QTY" INTEGER NOT NULL,
ADD COLUMN     "month" "MonthName",
ADD COLUMN     "status" "PAY_STATUS" NOT NULL,
ADD COLUMN     "total_amount" DECIMAL(10,2) NOT NULL;

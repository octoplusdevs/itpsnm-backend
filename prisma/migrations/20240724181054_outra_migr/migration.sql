/*
  Warnings:

  - You are about to drop the column `paymentsId` on the `receipts` table. All the data in the column will be lost.
  - Changed the type of `payment_id` on the `receipts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_paymentsId_fkey";

-- AlterTable
ALTER TABLE "receipts" DROP COLUMN "paymentsId",
DROP COLUMN "payment_id",
ADD COLUMN     "payment_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

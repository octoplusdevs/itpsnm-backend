/*
  Warnings:

  - You are about to drop the column `studentId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `studentbalance` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_studentId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "studentbalance" DROP CONSTRAINT "studentbalance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_studentId_fkey";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "studentId",
ADD COLUMN     "transactionId" INTEGER;

-- AlterTable
ALTER TABLE "studentbalance" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "created_at",
DROP COLUMN "studentId",
DROP COLUMN "transactionDate",
DROP COLUMN "update_at",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "paymentId" DROP NOT NULL,
ALTER COLUMN "transactionNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

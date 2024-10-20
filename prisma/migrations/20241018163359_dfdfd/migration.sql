/*
  Warnings:

  - A unique constraint covering the columns `[transactionNumber]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "PAY_STATUS" ADD VALUE 'RECUSED';

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionNumber_key" ON "transactions"("transactionNumber");

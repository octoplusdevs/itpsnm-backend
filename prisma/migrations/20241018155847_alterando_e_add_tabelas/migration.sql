/*
  Warnings:

  - You are about to drop the column `amount_paid` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `identityCardNumber` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `items_payment_details` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invoiceId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('A', 'B', 'C');

-- DropForeignKey
ALTER TABLE "items_payment_details" DROP CONSTRAINT "items_payment_details_paymentsId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_identityCardNumber_fkey";

-- DropIndex
DROP INDEX "payments_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount_paid",
DROP COLUMN "identityCardNumber",
DROP COLUMN "state",
ADD COLUMN     "employeeId" INTEGER,
ADD COLUMN     "enrollmentId" INTEGER,
ADD COLUMN     "invoiceId" INTEGER NOT NULL,
ADD COLUMN     "status" VARCHAR(20) NOT NULL,
ADD COLUMN     "studentId" INTEGER NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "items_payment_details";

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrollmentId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "transactionNumber" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrollmentId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentitems" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymentitems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentdetails" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "paymentItemId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymentdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentbalance" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "enrollmentId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studentbalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_paymentId_key" ON "transactions"("paymentId");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentdetails" ADD CONSTRAINT "paymentdetails_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentdetails" ADD CONSTRAINT "paymentdetails_paymentItemId_fkey" FOREIGN KEY ("paymentItemId") REFERENCES "paymentitems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentbalance" ADD CONSTRAINT "studentbalance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentbalance" ADD CONSTRAINT "studentbalance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

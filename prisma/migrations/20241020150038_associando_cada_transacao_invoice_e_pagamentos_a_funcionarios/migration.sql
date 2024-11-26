/*
  Warnings:

  - Made the column `enrollmentId` on table `invoices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enrollmentId` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_enrollmentId_fkey";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "employeeId" INTEGER,
ALTER COLUMN "enrollmentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "employeeId" INTEGER,
ALTER COLUMN "enrollmentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - The `status` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "status",
ADD COLUMN     "status" "PAY_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "status",
ADD COLUMN     "status" "PAY_STATUS" NOT NULL DEFAULT 'PENDING';

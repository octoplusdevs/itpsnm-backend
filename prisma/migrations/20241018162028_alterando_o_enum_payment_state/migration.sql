/*
  Warnings:

  - The values [COMPLETED,FAILED] on the enum `PaymentState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentState_new" AS ENUM ('PENDING', 'PAID');
ALTER TYPE "PaymentState" RENAME TO "PaymentState_old";
ALTER TYPE "PaymentState_new" RENAME TO "PaymentState";
DROP TYPE "PaymentState_old";
COMMIT;

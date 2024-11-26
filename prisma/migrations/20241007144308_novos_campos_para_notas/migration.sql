-- CreateEnum
CREATE TYPE "APPROVED_STATE" AS ENUM ('APPROVED', 'FAILED', 'WITH_DEFICIENCY');

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "approved" "APPROVED_STATE" NOT NULL DEFAULT 'FAILED',
ADD COLUMN     "ims" DOUBLE PRECISION;

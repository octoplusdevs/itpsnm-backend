/*
  Warnings:

  - You are about to drop the column `student_id` on the `payments` table. All the data in the column will be lost.
  - Changed the type of `type` on the `items_payment_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `identityCardNumber` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('A', 'B', 'C', 'D');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_student_id_fkey";

-- AlterTable
ALTER TABLE "items_payment_details" DROP COLUMN "type",
ADD COLUMN     "type" "PaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "student_id",
ADD COLUMN     "identityCardNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_identityCardNumber_fkey" FOREIGN KEY ("identityCardNumber") REFERENCES "students"("identityCardNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

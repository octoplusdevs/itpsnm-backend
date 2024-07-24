/*
  Warnings:

  - You are about to drop the column `studentId` on the `enrollments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identityCardNumber]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentId_fkey";

-- DropIndex
DROP INDEX "enrollments_studentId_key";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "studentId",
ADD COLUMN     "identityCardNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_identityCardNumber_key" ON "enrollments"("identityCardNumber");

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_identityCardNumber_fkey" FOREIGN KEY ("identityCardNumber") REFERENCES "students"("identityCardNumber") ON DELETE SET NULL ON UPDATE CASCADE;

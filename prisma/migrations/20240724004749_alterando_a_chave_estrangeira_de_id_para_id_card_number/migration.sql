/*
  Warnings:

  - You are about to drop the column `studentId` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_studentId_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "studentId",
ADD COLUMN     "identityCardNumber" TEXT;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_identityCardNumber_fkey" FOREIGN KEY ("identityCardNumber") REFERENCES "students"("identityCardNumber") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `studentId` on the `notes` table. All the data in the column will be lost.
  - Added the required column `enrollmentId` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_studentId_fkey";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "studentId",
ADD COLUMN     "enrollmentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

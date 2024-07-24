/*
  Warnings:

  - You are about to drop the column `fileId` on the `documents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_fileId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "fileId";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "documentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_studentId_key" ON "enrollments"("studentId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

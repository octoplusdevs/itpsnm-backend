/*
  Warnings:

  - You are about to drop the column `studentsId` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `classeId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `students` table. All the data in the column will be lost.
  - Added the required column `update_at` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_studentsId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classeId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_courseId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_levelId_fkey";

-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "studentsId",
ADD COLUMN     "classeId" INTEGER,
ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "levelId" INTEGER,
ADD COLUMN     "studentId" INTEGER;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "classeId",
DROP COLUMN "courseId",
DROP COLUMN "levelId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `course` on the `classes` table. All the data in the column will be lost.
  - Changed the type of `name` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `period` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "ClasseType" AS ENUM ('A', 'B', 'C', 'D');

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_id_classroom_fkey";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "course",
ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "course_id" INTEGER,
DROP COLUMN "name",
ADD COLUMN     "name" "ClasseType" NOT NULL,
ALTER COLUMN "id_classroom" DROP NOT NULL,
DROP COLUMN "period",
ADD COLUMN     "period" "PeriodType" NOT NULL;

-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 40;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_id_classroom_fkey" FOREIGN KEY ("id_classroom") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

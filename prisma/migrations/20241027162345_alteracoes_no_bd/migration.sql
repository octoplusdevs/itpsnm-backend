/*
  Warnings:

  - You are about to drop the column `course` on the `classes` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `period` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- CreateEnum
CREATE TYPE "ClasseType" AS ENUM ('A', 'B', 'C', 'D');

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "course",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "course_id" INTEGER NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "ClasseType" NOT NULL,
DROP COLUMN "period",
ADD COLUMN     "period" "PeriodType" NOT NULL;

-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 40;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `counties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `counties` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_countyId_fkey";

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "counties" TEXT NOT NULL;

-- DropTable
DROP TABLE "counties";

/*
  Warnings:

  - Added the required column `currentOccupancy` to the `classrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classrooms" ADD COLUMN     "currentOccupancy" INTEGER NOT NULL;

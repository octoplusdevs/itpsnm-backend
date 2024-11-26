/*
  Warnings:

  - You are about to drop the column `countyId` on the `students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "countyId",
ADD COLUMN     "county" TEXT;

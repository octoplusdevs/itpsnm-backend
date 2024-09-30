/*
  Warnings:

  - You are about to drop the column `userId` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_userId_fkey";

-- DropIndex
DROP INDEX "enrollments_userId_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "userId";

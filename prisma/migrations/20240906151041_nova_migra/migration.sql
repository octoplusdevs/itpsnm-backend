/*
  Warnings:

  - The values [T1,T2,T3] on the enum `Mester` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `level` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Mester_new" AS ENUM ('FIRST', 'SECOND', 'THIRD');
ALTER TABLE "notes" ALTER COLUMN "mester" TYPE "Mester_new" USING ("mester"::text::"Mester_new");
ALTER TYPE "Mester" RENAME TO "Mester_old";
ALTER TYPE "Mester_new" RENAME TO "Mester";
DROP TYPE "Mester_old";
COMMIT;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "level" "LevelName" NOT NULL;

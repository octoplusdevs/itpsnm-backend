/*
  Warnings:

  - You are about to drop the column `mester` on the `notes` table. All the data in the column will be lost.
  - Added the required column `first_mester` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second_mester` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `third_mester` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "mester",
ADD COLUMN     "first_mester" BOOLEAN NOT NULL,
ADD COLUMN     "second_mester" BOOLEAN NOT NULL,
ADD COLUMN     "third_mester" BOOLEAN NOT NULL;

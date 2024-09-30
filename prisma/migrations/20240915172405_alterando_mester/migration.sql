/*
  Warnings:

  - You are about to drop the column `first_mester` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `second_mester` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `third_mester` on the `notes` table. All the data in the column will be lost.
  - Added the required column `mester` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "first_mester",
DROP COLUMN "second_mester",
DROP COLUMN "third_mester",
ADD COLUMN     "mester" "Mester" NOT NULL;

/*
  Warnings:

  - You are about to drop the column `first_mester` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `p1` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `p2` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `pt` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `second_mester` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `third_mester` on the `notes` table. All the data in the column will be lost.
  - Added the required column `pf1` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pf2` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pft` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ps1` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ps2` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pst` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pt1` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pt2` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ptt` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "first_mester",
DROP COLUMN "p1",
DROP COLUMN "p2",
DROP COLUMN "pt",
DROP COLUMN "second_mester",
DROP COLUMN "third_mester",
ADD COLUMN     "pf1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pf2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pft" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ps1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ps2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pst" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pt1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pt2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ptt" DOUBLE PRECISION NOT NULL;

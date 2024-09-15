/*
  Warnings:

  - You are about to drop the column `exam` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `notes` table. All the data in the column will be lost.
  - Added the required column `mf` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mfd` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mt1` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mt2` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mt3` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pt` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "exam",
DROP COLUMN "resource",
ADD COLUMN     "mf" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mfd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mt1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mt2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mt3" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pt" DOUBLE PRECISION NOT NULL;

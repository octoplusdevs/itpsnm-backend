/*
  Warnings:

  - You are about to drop the column `state` on the `enrollments` table. All the data in the column will be lost.
  - Added the required column `docsState` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentState` to the `enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "state",
ADD COLUMN     "docsState" "EnrollementState" NOT NULL,
ADD COLUMN     "paymentState" "EnrollementState" NOT NULL;

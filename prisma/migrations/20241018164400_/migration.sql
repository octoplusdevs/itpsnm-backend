/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId]` on the table `studentbalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "studentbalance_enrollmentId_key" ON "studentbalance"("enrollmentId");

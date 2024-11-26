/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_enrollmentId_key" ON "users"("enrollmentId");

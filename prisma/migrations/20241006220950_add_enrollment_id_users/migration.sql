-- AlterTable
ALTER TABLE "users" ADD COLUMN     "enrollmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

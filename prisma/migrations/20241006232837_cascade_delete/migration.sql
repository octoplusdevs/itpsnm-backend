-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_studentId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

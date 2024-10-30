-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_courseId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_id_classroom_fkey";

-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "id_classroom" DROP NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "course_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_id_classroom_fkey" FOREIGN KEY ("id_classroom") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

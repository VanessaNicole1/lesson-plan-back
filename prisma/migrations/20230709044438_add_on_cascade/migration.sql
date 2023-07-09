-- DropForeignKey
ALTER TABLE "LessonPlanValidationTracking" DROP CONSTRAINT "LessonPlanValidationTracking_studentId_fkey";

-- AddForeignKey
ALTER TABLE "LessonPlanValidationTracking" ADD CONSTRAINT "LessonPlanValidationTracking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

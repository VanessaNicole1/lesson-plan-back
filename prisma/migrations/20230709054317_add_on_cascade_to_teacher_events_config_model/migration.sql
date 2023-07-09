-- DropForeignKey
ALTER TABLE "TeacherEventsConfig" DROP CONSTRAINT "TeacherEventsConfig_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "TeacherEventsConfig" ADD CONSTRAINT "TeacherEventsConfig_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

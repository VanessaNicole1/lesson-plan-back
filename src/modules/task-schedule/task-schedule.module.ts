import { Module } from "@nestjs/common";
import { TeacherTaskScheduleService } from "./teacher-task-schedule.service";
import { TeachersModule } from "../teachers/teachers.module";
import { PeriodsModule } from "../periods/periods.module";
import { StudentTaskScheduleService } from "./student-task-schedule.service";
import { LessonPlansModule } from "../lesson-plans/lesson-plans.module";

@Module({
  imports: [TeachersModule, PeriodsModule, LessonPlansModule],
  providers: [TeacherTaskScheduleService, StudentTaskScheduleService]
})
export class TaskScheduleModule {}

import { Module } from "@nestjs/common";
import { TeacherTaskScheduleService } from "./teacher-task-schedule.service";
import { TeachersModule } from "../teachers/teachers.module";
import { PeriodsModule } from "../periods/periods.module";
import { StudentTaskScheduleService } from "./student-task-schedule.service";

@Module({
  imports: [TeachersModule, PeriodsModule],
  providers: [TeacherTaskScheduleService, StudentTaskScheduleService]
})
export class TaskScheduleModule {}

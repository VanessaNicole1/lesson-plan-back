import { UsersModule } from './../users/users.module';
import { Module } from "@nestjs/common";
import { TeacherTaskScheduleService } from "./teacher-task-schedule.service";
import { TeachersModule } from "../teachers/teachers.module";
import { PeriodsModule } from "../periods/periods.module";
import { StudentTaskScheduleService } from "./student-task-schedule.service";
import { LessonPlansModule } from "../lesson-plans/lesson-plans.module";
import { PeriodTaskScheduleService } from "./period-task-schedule.service";
import { UserTaskScheduleService } from "./user-task-schedule.service";

@Module({
  imports: [TeachersModule, PeriodsModule, LessonPlansModule, UsersModule],
  providers: [TeacherTaskScheduleService, StudentTaskScheduleService, PeriodTaskScheduleService, UserTaskScheduleService]
})
export class TaskScheduleModule {}

import { Module } from "@nestjs/common";
import { TaskScheduleService } from "./task-schedule.service";
import { TeachersModule } from "../teachers/teachers.module";
import { PeriodsModule } from "../periods/periods.module";

@Module({
  imports: [TeachersModule, PeriodsModule],
  providers: [TaskScheduleService]
})
export class TaskScheduleModule {}
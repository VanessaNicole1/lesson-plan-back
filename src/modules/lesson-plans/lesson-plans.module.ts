import { Module } from '@nestjs/common';
import { LessonPlansService } from './lesson-plans.service';
import { LessonPlansController } from './lesson-plans.controller';
import { LessonPlansRepository } from './lesson-plans.repository';
import { SchedulesModule } from '../schedules/schedules.module';
import { LessonPlanValidationTrackingModule } from '../lesson-plan-validation-tracking/lesson-plan-tracking.module';
import { PeriodsModule } from '../periods/periods.module';

@Module({
  imports: [
    SchedulesModule,
    LessonPlanValidationTrackingModule,
    PeriodsModule,
  ],
  controllers: [LessonPlansController],
  providers: [LessonPlansService, LessonPlansRepository],
  exports: [LessonPlansService]
})
export class LessonPlansModule {}

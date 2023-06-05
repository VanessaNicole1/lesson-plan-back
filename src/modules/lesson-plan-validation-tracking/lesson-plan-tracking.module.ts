import { LessonPlansTrackingRepository } from './lesson-plan-tracking.repository';
import { Module } from '@nestjs/common';
import { LessonPlansTrackingController } from './lesson-plan-tracking.controller';
import { LessonPlansTrackingService } from './lesson-plan-tracking.service';

@Module({
  imports: [],
  controllers: [LessonPlansTrackingController],
  providers: [LessonPlansTrackingService, LessonPlansTrackingRepository]
})
export class LessonPlanValidationTrackingModule {}

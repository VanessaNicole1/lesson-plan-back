import { LessonPlansTrackingRepository } from './lesson-plan-tracking.repository';
import { Module, forwardRef } from '@nestjs/common';
import { LessonPlansTrackingController } from './lesson-plan-tracking.controller';
import { LessonPlansTrackingService } from './lesson-plan-tracking.service';
import { LessonPlansModule } from '../lesson-plans/lesson-plans.module';

@Module({
  imports: [forwardRef(() => LessonPlansModule)],
  controllers: [LessonPlansTrackingController],
  providers: [LessonPlansTrackingService, LessonPlansTrackingRepository],
  exports: [LessonPlansTrackingService]
})
export class LessonPlanValidationTrackingModule {}

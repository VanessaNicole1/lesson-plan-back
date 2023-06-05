import { Controller } from '@nestjs/common';
import { LessonPlansTrackingService } from './lesson-plan-tracking.service';

@Controller('lesson-plans-tracking')
export class LessonPlansTrackingController {
  constructor(private readonly lessonPlansTrackingService: LessonPlansTrackingService) {}
}

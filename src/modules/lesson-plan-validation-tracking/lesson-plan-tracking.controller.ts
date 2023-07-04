import { Controller, Post, Body } from '@nestjs/common';
import { LessonPlansTrackingService } from './lesson-plan-tracking.service';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';

@Controller('lesson-plans-tracking')
export class LessonPlansTrackingController {
  constructor(
    private readonly lessonPlansTrackingService: LessonPlansTrackingService,
  ) {}

  @Post()
  create(@Body() createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    return this.lessonPlansTrackingService.create(createLessonPlanTrackingDto);
  }
}

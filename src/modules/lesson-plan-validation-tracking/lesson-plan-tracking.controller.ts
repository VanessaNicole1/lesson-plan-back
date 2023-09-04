import { Controller, Body, Patch, Param } from '@nestjs/common';
import { LessonPlansTrackingService } from './lesson-plan-tracking.service';
import { UpdateLessonPlanTrackingDto } from './dto/update-lesson-plan-tracking.dto';

@Controller('lesson-plans-tracking')
export class LessonPlansTrackingController {
  constructor(
    private readonly lessonPlansTrackingService: LessonPlansTrackingService,
  ) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonPlanTrackingDto: UpdateLessonPlanTrackingDto,
  ) {
    return this.lessonPlansTrackingService.update(id, updateLessonPlanTrackingDto);
  }
}

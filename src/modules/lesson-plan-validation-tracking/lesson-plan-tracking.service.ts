import { Injectable } from '@nestjs/common';
import { LessonPlansTrackingRepository } from './lesson-plan-tracking.repository';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';

@Injectable()
export class LessonPlansTrackingService {
  constructor(
    private lessonPlansTrackingRepository: LessonPlansTrackingRepository,
  ) {}

  create(createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    return this.lessonPlansTrackingRepository.create(
      createLessonPlanTrackingDto,
    );
  }
}

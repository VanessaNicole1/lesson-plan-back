import { Injectable } from '@nestjs/common';
import { LessonPlansTrackingRepository } from './lesson-plan-tracking.repository';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';

@Injectable()
export class LessonPlansTrackingService {
  constructor(
    private lessonPlansTrackingRepository: LessonPlansTrackingRepository,
  ) {}

  getLessonPlansByStudentsAndPeriods(isValidated: boolean, studentIds: string[], periodIds: string[]) {
    return this.lessonPlansTrackingRepository.getLessonPlansByStudentsAndPeriods(isValidated, studentIds, periodIds);
  }

  create(createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    return this.lessonPlansTrackingRepository.create(
      createLessonPlanTrackingDto,
    );
  }

  removeLessonPlansTrackingByLessonPlan(lessonPlanId: string) {
    return this.lessonPlansTrackingRepository.removeLessonPlansTrackingByLessonPlan(lessonPlanId);
  }
}

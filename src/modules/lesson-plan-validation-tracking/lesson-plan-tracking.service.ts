import { Injectable } from '@nestjs/common';
import { LessonPlansTrackingRepository } from './lesson-plan-tracking.repository';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';
import { Exception } from 'handlebars';

@Injectable()
export class LessonPlansTrackingService {
  constructor(
    private lessonPlansTrackingRepository: LessonPlansTrackingRepository,
  ) {}

  getLessonPlansByStudentsAndPeriods(isValidated: boolean, studentIds: string[], periodIds: string[]) {
    return this.lessonPlansTrackingRepository.getLessonPlansByStudentsAndPeriods(isValidated, studentIds, periodIds);
  }

  async getLessonPlanTrackingByLessonPlanIdAndPeriod(lessonPlanId: string, periodId: string) {
    const lessonPlanTracking = await this.lessonPlansTrackingRepository.getLessonPlanTrackingByLessonPlanIdAndPeriod(lessonPlanId, periodId);
    
    if (!lessonPlanTracking) {
      // TODO: Add i18n
      throw new Exception('There is not a lesson plan with the request parameters');
    }

    return lessonPlanTracking;
  }

  create(createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    return this.lessonPlansTrackingRepository.create(
      createLessonPlanTrackingDto,
    );
  }

  removeLessonPlansTrackingByLessonPlan(lessonPlanId: string) {
    return this.lessonPlansTrackingRepository.removeLessonPlansTrackingByLessonPlan(lessonPlanId);
  }

  findLessonPlanTrackingByLessonPlanId(lessonPlanId: string) {
    return this.lessonPlansTrackingRepository.findLessonPlanTrackingByLessonPlanId(lessonPlanId);
  }
}

import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { LessonPlansTrackingRepository } from './lesson-plan-tracking.repository';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';
import { Exception } from 'handlebars';
import { UpdateLessonPlanTrackingDto } from './dto/update-lesson-plan-tracking.dto';
import { LessonPlansService } from '../lesson-plans/lesson-plans.service';

@Injectable()
export class LessonPlansTrackingService {
  constructor(
    private lessonPlansTrackingRepository: LessonPlansTrackingRepository,
    @Inject(forwardRef(() => LessonPlansService))
    private lessonPlanService: LessonPlansService,
  ) {}

  async findOne(id: string) {
    const lessonPlanTracking = await this.lessonPlansTrackingRepository.findOne(
      id,
    );

    if (!lessonPlanTracking) {
      throw new BadRequestException(
        'No hay un seguimiento del plan de lección con el id solicitado',
      );
    }

    return lessonPlanTracking;
  }

  async update(id: string, lessonPlanTrackingDto: UpdateLessonPlanTrackingDto) {
    const lessonPlanTracking = await this.findOne(id);
    const lessonPlanId = lessonPlanTracking.lessonPlan.id;
    const updatedLessonPlanTracking = await this.lessonPlansTrackingRepository.update(
      lessonPlanTracking.id,
      lessonPlanTrackingDto,
    );
    const currentLessonPlansTracking = await this.findLessonPlanTrackingByLessonPlanId(lessonPlanId);
    const currentValidatedLessonPlansTracking = currentLessonPlansTracking.filter((lessonPlanTracking) => !lessonPlanTracking.isValidated);
    if (currentValidatedLessonPlansTracking.length === 0) {
      await this.lessonPlanService.validateLessonPlan(lessonPlanId);
    }
    return updatedLessonPlanTracking;
  }

  getLessonPlansByStudentsAndPeriods(
    isValidated: boolean,
    studentIds: string[],
    periodIds: string[],
  ) {
    return this.lessonPlansTrackingRepository.getLessonPlansByStudentsAndPeriods(
      isValidated,
      studentIds,
      periodIds,
    );
  }

  async getLessonPlanTrackingByLessonPlanIdAndPeriod(
    lessonPlanId: string,
    periodId: string,
  ) {
    const lessonPlanTracking =
      await this.lessonPlansTrackingRepository.getLessonPlanTrackingByLessonPlanIdAndPeriod(
        lessonPlanId,
        periodId,
      );

    if (!lessonPlanTracking) {
      throw new Exception('No hay un plan de clase con los parámetros especificados');
    }

    return lessonPlanTracking;
  }

  create(createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    return this.lessonPlansTrackingRepository.create(
      createLessonPlanTrackingDto,
    );
  }

  removeLessonPlansTrackingByLessonPlan(lessonPlanId: string) {
    return this.lessonPlansTrackingRepository.removeLessonPlansTrackingByLessonPlan(
      lessonPlanId,
    );
  }

  findLessonPlanTrackingByLessonPlanId(lessonPlanId: string) {
    return this.lessonPlansTrackingRepository.findLessonPlanTrackingByLessonPlanId(
      lessonPlanId,
    );
  }
}

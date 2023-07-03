import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';

@Injectable()
export class LessonPlansTrackingRepository {
  constructor(private prisma: PrismaService) {}

  create(createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    const { lessonPlanId, students } = createLessonPlanTrackingDto;

    const lessonPlansTracking = students.map((studentId) => ({ lessonPlanId, studentId }));
    return this.prisma.lessonPlanValidationTracking.createMany({
      data: lessonPlansTracking
    })
  }
}

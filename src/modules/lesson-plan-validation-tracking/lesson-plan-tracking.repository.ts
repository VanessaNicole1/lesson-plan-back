import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateLessonPlanTrackingDto } from './dto/validate-lesson-plan.dto';

@Injectable()
export class LessonPlansTrackingRepository {
  constructor(private prisma: PrismaService) {}

  getLessonPlansByStudentsAndPeriods(isValidated: boolean, studentIds: string[], periodIds: string[]) {
    return this.prisma.lessonPlanValidationTracking.findMany({
      where: {
        studentId: {
          in: studentIds
        },
        AND: {
          periodId: {
            in: periodIds
          },
          isValidated: {
            equals: isValidated
          }
        }
      },
      include: {
        lessonPlan: {
          include: {
            schedule: {
              include: {
                teacher: {
                  include: {
                    user: true
                  }
                },
                grade: true,
                subject: true
              }
            }
          }
        }
      }
    })
  };

  create(createLessonPlanTrackingDto: CreateLessonPlanTrackingDto) {
    const { lessonPlanId, students, periodId } = createLessonPlanTrackingDto;
    const lessonPlansTracking = students.map((studentId) => ({ lessonPlanId, studentId, periodId}));
    return this.prisma.lessonPlanValidationTracking.createMany({
      data: lessonPlansTracking
    })
  }

  removeLessonPlansTrackingByLessonPlan(lessonPlanId) {
    return this.prisma.lessonPlanValidationTracking.deleteMany({
      where: {
        lessonPlanId,
      },
    });
  }
}

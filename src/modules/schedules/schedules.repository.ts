// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { FilterScheduleDto } from './dto/filter-schedule.dto';
import { LessonPlanType } from '../common/enums/lesson-plan-type.enum';

@Injectable()
export class SchedulesRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.schedule.findMany();
  }

  findAllByPeriodIds(periodIds: string[]) {
    return this.prisma.schedule.findMany({
      where: {
        periodId: {
          in: periodIds
        }
      },
      include: {
        subject: true,
        grade: true
      },
    })
  };

  findOne(id: string) {
    return this.prisma.schedule.findUnique({
      where: {
        id,
      },
      include: {
        subject: true,
        grade: true,
        teacher: {
          include: {
            user: true,
          }
        }
      }
    });
  }

  findSchedulesByTeacherInActivePeriod(periodId: string, teacherId: string) {
    return this.prisma.schedule.findMany({
      where: {
        teacherId,
        periodId,
      },
      include: {
        subject: true,
        grade: {
          include: {
            students: true,
          },
        },
        lessonPlans: true,
      },
    });
  }

  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const { metadata } = updateScheduleDto;
    return this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        metadata,
      },
    });
  }

  findByTeacher(teacherId: string) {
    return this.prisma.schedule.findMany({
      where: {
        teacherId,
      },
      include: {
        lessonPlans: true,
      },
    });
  }

  findSchedulesByUser(userId: string, filterScheduleDto: FilterScheduleDto) {
    const { periodId, subjectId, gradeId, hasQualified, type } = filterScheduleDto;
    const { NORMAL, REMEDIAL } = LessonPlanType;
    const lessonPlanTypes = {
      [NORMAL]: LessonPlanType.NORMAL,
      [REMEDIAL]: LessonPlanType.REMEDIAL
    }
    const currentHasQualified =
      hasQualified !== undefined
        ? (hasQualified === 'true' && true) ||
          (hasQualified === 'false' && false)
        : undefined;
      
    if (currentHasQualified) {
      return this.prisma.schedule.findMany({
        where: {
          teacher: {
            user: {
              id: userId,
            },
          },
          periodId,
          subjectId,
          gradeId,
        },
        include: {
          lessonPlans: {
            where: {
              type: lessonPlanTypes[type],
              hasQualified: currentHasQualified,
            },
          },
          teacher: {
            include: {
              user: true,
            },
          },
          grade: {
            include: {
              degree: {
                include: {
                  period: true,
                },
              },
            },
          },
          subject: true,
        },
      });
    } else {
      return this.prisma.schedule.findMany({
        where: {
          teacher: {
            user: {
              id: userId,
            },
          },
          periodId,
          subjectId,
          gradeId,
        },
        include: {
          lessonPlans:{
            where: {
              type: lessonPlanTypes[type],
              hasQualified: currentHasQualified,
            },
          },
          teacher: {
            include: {
              user: true,
            },
          },
          grade: {
            include: {
              degree: {
                include: {
                  period: true,
                },
              },
            },
          },
          subject: true,
        },
      });
    }
  }
}

// @ts-nocheck
import { UploadSignedRemedialPlanByManagerDTO } from './dto/upload-signed-remedial-plan-by-manager.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { CreateRemedialPlanDto } from './dto/create-remedial-plan.dto';
import { LessonPlanType } from '../common/enums/lesson-plan-type.enum';
@Injectable()
export class LessonPlansRepository {
  constructor(private prisma: PrismaService) {}

  private getAdittionalData() {
    return {
      include: {
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
        schedule: {
          include: {
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
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    };
  }

  findAll({
    period,
    type,
    isValidatedByManager,
    teacherId,
    studentId,
    isValidatedByStudent
  }: {
    period: string;
    type: LessonPlanType;
    isValidatedByManager?: boolean;
    teacherId?: string;
    studentId?: string;
    isValidatedByStudent?: boolean
  }) {
    const additionalFilters: any = {};

    if (isValidatedByManager !== undefined) {
      additionalFilters.isValidatedByManager = isValidatedByManager;
    }

    if (teacherId) {
      additionalFilters.schedule = {
        teacherId,
      };
    }

    if (studentId) {
      const scheduleFilters = { ...additionalFilters.schedule };
      additionalFilters.schedule = {
        grade: {
          students: {
            some: {
              id: studentId,
            },
          },
        },
        ...scheduleFilters,
      };
      

      if (isValidatedByStudent !== undefined) {
        additionalFilters.validationsTracking = {
          some: {
            isValidated: isValidatedByStudent,
            studentId: studentId
          }
        };
      }
    }

    return this.prisma.lessonPlan.findMany({
      where: {
        periodId: period,
        type,
        ...additionalFilters,
      },
      ...this.getAdittionalData(),
    });
  }

  findAllLessonPlanTypes() {
    return this.prisma.lessonPlan.findMany({
      ...this.getAdittionalData(),
    })
  }

  findAllLessonPlansWithAdittionalData() {
    return this.prisma.lessonPlan.findMany({
      ...this.getAdittionalData(),
    });
  }

  findOne(id: string) {
    return this.prisma.lessonPlan.findUnique({
      where: {
        id,
      },
      include: {
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
        schedule: {
          include: {
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
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  findOneWithPeriod(id: string) {
    return this.prisma.lessonPlan.findUnique({
      where: {
        id,
      },
      ...this.getAdittionalData(),
    });
  }

  findLessonPlanBySchedule(scheduleId: string) {
    return this.prisma.lessonPlan.findMany({
      where: {
        scheduleId,
      },
      ...this.getAdittionalData(),
    });
  }

  create(createLessonPlanDto: CreateLessonPlanDto) {
    const {
      periodId,
      scheduleId,
      date,
      topic,
      description,
      content,
      purposeOfClass,
      bibliography,
      materials,
      evaluation,
      comments,
      resources,
      notification,
      notificationDate,
      deadlineDate,
      results,
    } = createLessonPlanDto;
    return this.prisma.lessonPlan.create({
      data: {
        periodId,
        scheduleId,
        date: new Date(date),
        topic,
        content,
        resources,
        description,
        purposeOfClass,
        results,
        maximumValidationDate: new Date(deadlineDate),
        bibliography,
        materials,
        evaluation,
        comments,
        notification,
        notificationDate:
          notificationDate === undefined ? null : new Date(notificationDate),
      },
    });
  }

  async update(id: string, updateLessonPlanDto: UpdateLessonPlanDto) {
    const {
      periodId,
      date,
      topic,
      description,
      content,
      purposeOfClass,
      bibliography,
      materials,
      evaluation,
      comments,
      resources,
      results,
      deadlineDate,
    } = updateLessonPlanDto;
    await this.findOne(id);
    delete updateLessonPlanDto.students;
    const updatedLessonPlan = await this.prisma.lessonPlan.update({
      where: {
        id,
      },
      data: {
        periodId,
        topic,
        description,
        content,
        purposeOfClass,
        results,
        bibliography,
        materials,
        evaluation,
        comments,
        resources,
        date: new Date(date),
        maximumValidationDate: new Date(deadlineDate),
      },
      ...this.getAdittionalData(),
    });
    return updatedLessonPlan;
  }

  async remove(id: string) {
    const deleteLessonPlan = await this.prisma.lessonPlan.delete({
      where: {
        id,
      },
    });
    return deleteLessonPlan;
  }

  async removeResource(id: string, resources: any) {
    await this.prisma.lessonPlan.update({
      where: {
        id,
      },
      data: {
        resources: resources,
      },
    });
  }

  findLessonPlansForTeacherReport(
    from: Date,
    to: Date,
    periodId: string,
    teacherId: string,
    subjectId: string,
    gradeId: string,
  ) {
    const additionalScheduleFilters: any = {};

    if (subjectId) {
      additionalScheduleFilters.subject = {
        id: subjectId,
      };
    }

    if (gradeId) {
      additionalScheduleFilters.grade = {
        id: gradeId,
      };
    }

    const whereCondition = {
      periodId,
      schedule: {
        teacher: {
          id: teacherId,
        },
        ...additionalScheduleFilters,
      },
      date: {
        gte: from,
        lte: to,
      },
    };

    // TODO: Check for just qualified lessonPlans
    return this.prisma.lessonPlan.findMany({
      orderBy: [
        {
          schedule: {
            grade: {
              number: 'asc',
            },
          },
        },
        {
          schedule: {
            grade: {
              parallel: 'asc',
            },
          },
        },
        {
          date: 'asc',
        },
      ],
      where: whereCondition,
      include: {
        schedule: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
            subject: true,
            grade: true,
          },
        },
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  findLessonPlanForReport(id: string) {
    return this.prisma.lessonPlan.findUnique({
      where: {
        id,
      },
      include: {
        schedule: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
            subject: true,
            grade: true,
          },
        },
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  expireLessonPlan(lessonPlanId: string) {
    return this.prisma.lessonPlan.update({
      where: {
        id: lessonPlanId,
      },
      data: {
        validationExpired: true,
      },
    });
  }

  findLessonPlansByTeacherIdsBetweenDates(
    from: Date,
    to: Date,
    teacherIds: string[],
  ) {
    return this.prisma.lessonPlan.findMany({
      where: {
        schedule: {
          teacher: {
            id: {
              in: teacherIds,
            },
          },
        },
        date: {
          gte: from,
          lte: to,
        },
      },
      include: {
        schedule: {
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  validateLessonPlan(lessonPlanId: string) {
    return this.prisma.lessonPlan.update({
      where: {
        id: lessonPlanId,
      },
      data: {
        hasQualified: true,
      },
    });
  }

  createRemedialPlan(createRemedialPlanDto: CreateRemedialPlanDto) {
    const {
      periodId,
      scheduleId,
      date,
      topic,
      description,
      content,
      purposeOfClass,
      bibliography,
      materials,
      evaluation,
      comments,
      resources,
      results,
      trackingSteps,
    } = createRemedialPlanDto;
    return this.prisma.lessonPlan.create({
      data: {
        periodId,
        scheduleId,
        date: new Date(date),
        topic,
        content,
        resources,
        description,
        purposeOfClass,
        bibliography,
        materials,
        evaluation,
        comments,
        results,
        type: 'REMEDIAL',
        trackingSteps,
      },
    });
  }

  uploadSignedReportByTeacher(
    remedialPlanId: string,
    remedialReport: any,
    trackingSteps: any,
  ) {
    return this.prisma.lessonPlan.update({
      where: {
        id: remedialPlanId,
      },
      data: {
        remedialReports: remedialReport,
        trackingSteps,
      },
      include: {
        schedule: {
          include: {
            grade: {
              include: {
                degree: {
                  include: {
                    manager: {
                      include: {
                        user: true,
                      },
                    },
                    period: true,
                  },
                },
              },
            },
            teacher: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        },
      },
    });
  }

  uploadSignedReportByManager(
    uploadSignedRemedialPlanByManagerDTO: UploadSignedRemedialPlanByManagerDTO,
  ) {
    const { remedialPlanId, trackingSteps, remedialReports, deadline } =
      uploadSignedRemedialPlanByManagerDTO;
    return this.prisma.lessonPlan.update({
      where: {
        id: remedialPlanId,
      },
      data: {
        remedialReports,
        trackingSteps,
        isValidatedByManager: true,
        maximumValidationDate: deadline,
      },
      include: {
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
        schedule: {
          include: {
            grade: {
              include: {
                degree: {
                  include: {
                    manager: {
                      include: {
                        user: true,
                      },
                    },
                    period: true,
                  },
                },
              },
            },
            teacher: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        },
      },
    });
  }

  updateRemedialLessonPlanTrackingSteps(id: string, trackingSteps: any) {
    return this.prisma.lessonPlan.update({
      where: {
        id
      },
      data: {
        trackingSteps
      }
    })
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';

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
              }
            },
          },
        },
      },
    };
  }

  findAll() {
    return this.prisma.lessonPlan.findMany();
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
            teacher: {
              include: {
                user: true
              }
            },
            subject: true,
          }
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

  findLessonPlansForTeacherReport(from: Date, to: Date, periodId: string, subjectId: string, teacherId: string, gradeId: string) {
    // TODO: Check for just qualified lessonPlans
    return this.prisma.lessonPlan.findMany({
      where: {
        periodId,
        schedule: {
          subject: {
            id: subjectId
          },
          teacher: {
            id: teacherId
          },
          grade: {
            id: gradeId
          }
        },
        createdAt: {
          gte: from,
          lte: to
        }
      },
      include: {
        schedule: {
          include: {
            teacher: {
              include: {
                user: true
              }
            },
            subject: true,
            grade: true
          }
        },
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
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
                user: true
              }
            },
            subject: true,
            grade: true
          }
        },
        validationsTracking: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
  }

  findLessonPlansByTeacherIdsBetweenDates(from: Date, to: Date, teacherIds: string[]) {
    return this.prisma.lessonPlan.findMany({
      where: {
        schedule: {
          teacher: {
            id: {
              in: teacherIds
            }
          }
        },
        date: {
          gte: from,
          lte: to
        }
      },
      include: {
        schedule: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          }
        },
      }
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
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
          },
        },
      },
    };
  }

  findAll() {
    return this.prisma.lessonPlan.findMany();
  }

  async findOne(id: string) {
    const lessonPlan = await this.prisma.lessonPlan.findUnique({
      where: {
        id,
      },
      ...this.getAdittionalData(),
    });

    if (!lessonPlan) {
      throw new NotFoundException(
        `Plan de clases con id "${id}" no encontrado`,
      );
    }

    return lessonPlan;
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
      resources,
      // notificationDate,
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
        resources,
        date: new Date(date),
        // notificationDate: new Date(notificationDate),
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
}

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
        validationsTracking: true,
        schedule: true,
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
      throw new NotFoundException(`Plan de clases con id "${id}" no encontrado`);
    }

    return lessonPlan;
  }

  findLessonPlanBySchedule(scheduleId: string) {
    return this.prisma.lessonPlan.findMany({
      where: {
        scheduleId,
      },
      ...this.getAdittionalData()
    })
  }

  create(createLessonPlanDto: CreateLessonPlanDto) {
    const { date, topic, content, scheduleId, resources } = createLessonPlanDto;
    return this.prisma.lessonPlan.create({
      data: {
        date: new Date(date),
        topic,
        content,
        scheduleId,
        resources,
      }
    })
  }

  async update(id: string, updateLessonPlanDto: UpdateLessonPlanDto) {
    await this.findOne(id);
    const updatedLessonPlan = await this.prisma.lessonPlan.update({
      where: {
        id,
      },
      data: {
        ...updateLessonPlanDto,
        date: updateLessonPlanDto.date && new Date(updateLessonPlanDto.date)
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
}

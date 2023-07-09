import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherEventConfigDto } from './dto/update-teacher-config.dto';

@Injectable()
export class TeachersRepository {
  constructor(private prisma: PrismaService) {}

  findAllByTeacherIds(teacherIds: string[]) {
    return this.prisma.teacher.findMany({
      where: {
        id: {
          in: teacherIds
        }
      },
      include: {
        user: true
      }
    });
  };

  async findAll(filterTeacherDto?: FilterTeacherDto) {
    const { periodId } = filterTeacherDto;
    return await this.prisma.teacher.findMany({
      where: {
        schedules: {
          some: {
            grade: {
              degree: {
                period: {
                  id: periodId,
                },
              },
            },
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  findTeacherByUserInActivePeriod(periodId: string, userId: string) {
    return this.prisma.teacher.findFirst({
      where: {
        userId,
        periodId,
      },
    });
  }

  findTeacherActivePeriodsByUser(periodIds: string[], userId: string) {
    return this.prisma.teacher.findMany({
      where: {
        userId,
        AND: {
          periodId: {
            in: periodIds,
          },
        },
      },
    });
  }

  findTeachersByUser(userId: string) {
    return this.prisma.teacher.findMany({
      where: {
        userId,
      },
    });
  }

  findTeacherEventsByPeriodIdsAndTeacherIds(periodIds: string[], teacherIds: string[]) {
    return this.prisma.teacherEventsConfig.findMany({
      where: {
        periodId: {
          in: periodIds
        },
        AND: {
          teacherId: {
            in: teacherIds
          }
        }
      }
    })
  }

  findTeacherEventsConfigByPeriodIds(periodIds: string[]) {
    return this.prisma.teacherEventsConfig.findMany({
      where: {
        periodId: {
          in: periodIds
        }
      }
    })
  };

  findTeachersEvents(teacherId: string) {
    return this.prisma.teacherEventsConfig.findMany({
      where: {
        teacherId: teacherId,
      },
    });
  }

  updateTeacherEventConfig(
    id: string,
    updateTeacherEventConfigDto: UpdateTeacherEventConfigDto,
  ) {
    const { metadata } = updateTeacherEventConfigDto;
    return this.prisma.teacherEventsConfig.update({
      where: {
        id,
      },
      data: {
        metadata,
      },
    });
  }

  removeTeachersByPeriod(periodId: string) {
    return this.prisma.teacher.deleteMany({
      where: {
        periodId,
      },
    });
  }

  findTeacherPeriodsByUser(periodIds: string[], userId: string) {
    return this.prisma.teacher.findMany({
      where: {
        userId,
        AND: {
          periodId: {
            in: periodIds,
          },
        },
      },
    });
  }
}

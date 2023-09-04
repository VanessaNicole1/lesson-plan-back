import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterSubjectDto } from './dto/filter-subject.dto';

@Injectable()
export class SubjectsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterSubjectDto?: FilterSubjectDto) {
    const { periodId } = filterSubjectDto;
    return this.prisma.subject.findMany({
      where: {
        schedules: {
          every: {
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
        schedules: {
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
            lessonPlans: true,
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

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
      include: {
        schedules: {
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
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Materia con id "${id}" no encontrada`);
    }

    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const { name, periodId } = updateSubjectDto;
    const currentSubject = await this.prisma.subject.findMany({
      where: {
        name: {
          equals: name,
        },
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
        schedules: {
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
          },
        },
      },
    });

    if (currentSubject) {
      throw new NotFoundException(`Materia con el nombre "${name}" ya existe`);
    }

    await this.prisma.subject.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return {
      message: 'Se actualizó con éxito la materia',
    };
  }

  removeSubjectsByPeriod(periodId: string) {
    return this.prisma.subject.deleteMany({
      where: {
        periodId,
      },
    });
  }
}

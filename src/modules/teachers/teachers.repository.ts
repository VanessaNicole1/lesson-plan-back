import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterTeacherDto } from './dto/filter-teacher.dto';

@Injectable()
export class TeachersRepository {
  constructor(private prisma: PrismaService) {}

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
}

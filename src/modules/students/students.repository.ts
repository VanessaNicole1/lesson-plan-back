import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterStudentDto } from './dto/filter-student.dto';

@Injectable()
export class StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filterStudentDto?: FilterStudentDto) {
    const { gradeId, periodId } = filterStudentDto;
    return await this.prisma.student.findMany({
      where: {
        grade: {
          id: gradeId,
          degree: {
            period: {
              id: periodId,
            },
          },
        },
      },
      include: {
        user: true,
        grade: true,
      },
    });
  }
}

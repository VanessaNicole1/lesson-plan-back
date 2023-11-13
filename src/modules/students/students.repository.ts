// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterStudentDto } from './dto/filter-student.dto';

@Injectable()
export class StudentsRepository {
  constructor(private prisma: PrismaService) {}

  findStudentsByUser(userId: string) {
    return this.prisma.student.findMany({
      where: {
        userId
      }
    })
  }

  findStudentsInPeriodsByUser(periodIds: string[], userId: string) {
    return this.prisma.student.findMany({
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

  getStudentsByUserAndPeriod(userId: string, periodId: string) {
    return this.prisma.student.findMany({
      where: {
        userId,
        AND: {
          periodId: {
            equals: periodId
          }
        }
      }
    });
  }
  
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
        lessonPlansValidation: true,
      },
    });
  }
}

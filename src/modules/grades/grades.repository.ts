// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterGradeDto } from './dto/filter-grade.dto';

@Injectable()
export class GradesRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterGradeDto?: FilterGradeDto) {
    const { numberParallel, parallel, degreeId, periodId } = filterGradeDto;
    return this.prisma.grade.findMany({
      where: {
        number: numberParallel,
        parallel,
        degree: {
          id: degreeId,
          period: {
            id: periodId,
          },
        },
      },
    });
  }
}

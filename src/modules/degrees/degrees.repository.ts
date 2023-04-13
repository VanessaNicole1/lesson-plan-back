import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterDegreeDto } from './dto/filter-degree.dto';

@Injectable()
export class DegreesRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterDegreeDto?: FilterDegreeDto) {
    const { name, periodId } = filterDegreeDto;
    return this.prisma.degree.findMany({
      where: {
        name,
        period: {
          id: periodId,
        },
      },
    });
  }
}

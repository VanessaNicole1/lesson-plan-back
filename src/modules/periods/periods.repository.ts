import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterPeriodDto } from './dto/filter-period.dto';

@Injectable()
export class PeriodsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterPeriodDto: FilterPeriodDto = {}) {
    const { isActive } = filterPeriodDto;
    return this.prisma.period.findMany({
      where: {
        isActive,
      },
    });
  }
}

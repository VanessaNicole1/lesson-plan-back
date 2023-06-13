import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterPeriodDto } from './dto/filter-period.dto';

@Injectable()
export class PeriodsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterPeriodDto: FilterPeriodDto = {}) {
    const { isActive, idManagerUser } = filterPeriodDto;
    return this.prisma.period.findMany({
      where: {
        isActive,
        degree: {
          manager: {
            user: {
              id: idManagerUser,
            },
          },
        },
      },
      include: {
        degree: {
          include: {
            manager: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.period.findUnique({
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.period.delete({
      where: {
        id,
      },
    });
  }

  findActivePeriods() {
    return this.prisma.period.findMany({
      where: {
        isActive: true,
      },
    });
  }

  findByPeriodIds(periodIds: string[]) {
    return this.prisma.period.findMany({
      where: {
        id: {
          in: periodIds,
        },
      },
    });
  }
}

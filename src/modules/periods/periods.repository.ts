import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterPeriodDto } from './dto/filter-period.dto';

@Injectable()
export class PeriodsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterPeriodDto: FilterPeriodDto = {}) {
    const { isActive, idManagerUser } = filterPeriodDto;
    // TODO: Validate when isActive is false since the value to undefined is false
    const activePeriod = isActive !== undefined ? (isActive === 'true' && true) || (isActive === 'false' && false) : undefined;
    return this.prisma.period.findMany({
      where: {
        isActive: activePeriod,
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

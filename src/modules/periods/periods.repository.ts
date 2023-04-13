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
}

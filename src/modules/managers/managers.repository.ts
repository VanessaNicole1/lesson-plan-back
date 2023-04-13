import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { FilterManagerDto } from './dto/filter-manager.dto';
@Injectable()
export class ManagersRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filterManagerDto?: FilterManagerDto) {
    const { periodId, degreeId } = filterManagerDto;
    return this.prisma.manager.findMany({
      where: {
        degree: {
          id: degreeId,
          period: {
            id: periodId,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }
}

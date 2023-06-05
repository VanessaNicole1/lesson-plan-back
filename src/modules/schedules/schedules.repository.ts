import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class SchedulessRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.schedule.findMany();
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Calendario con id "${id}" no encontrado`);
    }

    return schedule;
  }
}

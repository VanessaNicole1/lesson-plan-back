import { PrismaService } from "../common/services/prisma.service";

export class SchedulesRepository {
  constructor (private prisma: PrismaService) {}

  findAll () {
    return this.prisma.schedule.findMany();
  }
}

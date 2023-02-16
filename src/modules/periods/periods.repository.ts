import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";

@Injectable()
export class PeriodsRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.period.findMany();
  }
}

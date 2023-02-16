import { PrismaService } from "../common/services/prisma.service";

export class TeachersRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.teacher.findMany();
  }
}

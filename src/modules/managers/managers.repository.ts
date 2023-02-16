import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";

@Injectable()
export class ManagersRepository {
  constructor (private prisma: PrismaService) {}

  findAll() {
    return this.prisma.manager.findMany();
  }
}

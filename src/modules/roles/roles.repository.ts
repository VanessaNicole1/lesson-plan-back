import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";

@Injectable()
export class RolesRepository {
  constructor (private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany();
  }
}

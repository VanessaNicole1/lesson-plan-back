import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";

@Injectable()
export class InitialProcessRepository {
  constructor (private prisma: PrismaService) {}

  findAll() {
    return [
      {
        name: 'Fake initial Process'
      }
    ];
  };
}

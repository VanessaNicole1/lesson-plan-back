import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Role } from '../../utils/enums/roles.enum';
@Injectable()
export class ManagersRepository {
  constructor(private prisma: PrismaService) {}

  findAll(id: string) {
    if (id) {
      return this.prisma.manager.findMany({
        where: {
          degree: {
            period: {
              id,
            },
          },
        },
        include: {
          user: {
            include: {
              roles: true,
            },
          },
        },
      });
    }
    return this.prisma.manager.findMany({
      include: {
        user: {
          include: {
            roles: {
              where: {
                name: Role.Teacher,
              },
            },
          },
        },
      },
    });
  }
}

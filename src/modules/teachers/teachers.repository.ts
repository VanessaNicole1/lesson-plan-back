import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Role } from '../../utils/enums/roles.enum';

@Injectable()
export class TeachersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(id?: string) {
    if (id) {
      return await this.prisma.teacher.findMany({
        where: {
          schedules: {
            some: {
              grade: {
                degree: {
                  period: {
                    id,
                  },
                },
              },
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

    return this.prisma.teacher.findMany({
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

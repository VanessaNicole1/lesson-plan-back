import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Role } from '../../utils/enums/roles.enum';

@Injectable()
export class StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(id?: string) {
    if (id) {
      return await this.prisma.student.findMany({
        where: {
          grade: {
            degree: {
              period: {
                id,
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
          grade: true,
        },
      });
    }
    return this.prisma.student.findMany({
      include: {
        user: {
          include: {
            roles: {
              where: {
                name: Role.Student,
              },
            },
          },
        },
        grade: true,
      },
    });
  }
}

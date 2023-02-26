import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    return this.prisma.role.create({
      data: {
        name: name.toUpperCase(),
      },
    });
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({
      where: {
        id,
      },
    });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findByName(name: string) {
    return this.prisma.role.findUnique({
      where: {
        name,
      },
    });
  }
}

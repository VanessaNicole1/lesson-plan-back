import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, lastName, email, password, ids } = createUserDto;
    let createUserData = {
      data: {
        name,
        lastName,
        email,
        password,
        displayName: `${name} ${lastName}`,
        refreshToken: '',
      },
    };
    if (ids) {
      const idsRole = [];

      for (let i = 0; i < ids.length; i++) {
        idsRole.push({ id: ids[i] });
      }

      const { data } = createUserData;

      const newData = {
        ...data,
        roles: {
          connect: idsRole,
        },
      };

      createUserData = {
        data: newData,
      };
    }
    return this.prisma.user.create(createUserData);
  }

  async assignRole(id: string, role: Role) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        roles: {
          connectOrCreate: {
            where: {
              id: role.id,
            },
            create: {
              name: role.name,
            },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    return user;
  }

  async findByUsername(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }
}

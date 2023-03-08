import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  private getAdittionalData() {
    return {
      include: {
        roles: true,
      },
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { name, lastName, email, password, roleIds } = createUserDto;

    const roles = roleIds?.map((roleId) => ({
      id: roleId,
    }));

    return this.prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password,
        displayName: `${name} ${lastName}`,
        roles: {
          connect: roles,
        },
      },
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;
    await this.findOne(id);
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
      ...this.getAdittionalData(),
    });

    return updatedUser;
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
      ...this.getAdittionalData(),
    });
  }

  findAll(type?: string) {
    if (type) {
      return this.prisma.user.findMany({
        where: {
          roles: {
            some: {
              name: type.toUpperCase(),
            },
          },
        },
        ...this.getAdittionalData(),
      });
    }
    return this.prisma.user.findMany({
      ...this.getAdittionalData(),
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      ...this.getAdittionalData(),
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
      ...this.getAdittionalData(),
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

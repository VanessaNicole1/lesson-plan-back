import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role as RoleEnum } from '../../utils/enums/roles.enum';
import { RolesService } from '../roles/roles.service';
import { CreateManagerUserDto } from './dto/create-manager-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
  ) {}

  private getAdittionalData() {
    return {
      include: {
        roles: true,
        registerConfig: true,
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

  async createManager(createManagerDto: CreateManagerUserDto) {
    const { name, lastName, email, roleIds } = createManagerDto;
    const roles = roleIds?.map((roleId) => ({
      id: roleId,
    }));
    return this.prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password: '',
        displayName: `${name} ${lastName}`,
        roles: {
          connect: roles,
        },
      }
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const {
      phoneNumber,
      city,
      identificationCard,
      name,
      lastName,
      roles: roleIds,
    } = updateUserDto;
    const disconnectRoles = [];
    const currentRoles = await this.rolesService.findAll();
    const currentRolesIds = currentRoles.map((role) => role.id);
    for (const roleId in currentRolesIds) {
      if (!roleIds.includes(currentRolesIds[roleId])) {
        disconnectRoles.push(currentRolesIds[roleId]);
      }
    }
    await this.findOne(id);
    const roles = roleIds?.map((roleId) => ({
      id: roleId,
    }));
    const disconnectRolesIds = disconnectRoles?.map((roleId) => ({
      id: roleId,
    }));
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        lastName,
        city,
        identificationCard,
        phoneNumber,
        roles: {
          connect: roles,
          disconnect: disconnectRolesIds,
        },
      },
      ...this.getAdittionalData(),
    });

    return updatedUser;
  }

  updatePassword(id: string, password: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
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

  findAll(filterUserDto: FilterUserDto = {}) {
    const { roleType, email, name } = filterUserDto;
    return this.prisma.user.findMany({
      where: {
        name,
        email,
        roles: {
          some: {
            name: roleType,
          },
        },
      },
      ...this.getAdittionalData(),
    });
  }

  findAllWithManagerRole() {
    return this.prisma.user.findMany({
      where: {
        roles: {
          some: {
            name: {
              equals: RoleEnum.Manager,
            },
          },
        },
      },
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
      ...this.getAdittionalData(),
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    return user;
  }

  findOneByRegisteredToken(registeredToken: string) {
    return this.prisma.user.findFirst({
      where: {
        registerConfig: {
          registerToken: {
            equals: registeredToken,
          },
        },
      },
      ...this.getAdittionalData(),
    });
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

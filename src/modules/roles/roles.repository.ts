import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const currentRole = await this.findByName(name.toUpperCase());

    if (!currentRole) {
      await this.prisma.role.create({
        data: {
          name: name.toUpperCase(),
        },
      });
      return 'El rol se creó con éxito';
    }
    throw new BadRequestException(`El role con el nombre ${name} ya existe`);
  }

  findOne(id: string) {
    const role = this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role con id "${id}" no encontrado`);
    }

    return role;
  }

  findAll() {
    return this.prisma.role.findMany({
      include: {
        users: true,
      },
    });
  }

  findByName(name: string) {
    return this.prisma.role.findUnique({
      where: {
        name,
      },
    });
  }
}

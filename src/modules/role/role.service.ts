import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role-dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getRoleById(id: string): Promise<Role> {
    if (!id) {
      throw new NotFoundException(`El rol no existe`);
    }
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException(`El role con ${id} no existe`);
    }
    return role;
  }

  async getRoleByType(type: string) {
    if (!type) {
      throw new NotFoundException(`El rol no existe`);
    }
    const role = await this.roleRepository.findOne({
      where: {
        type,
      },
    });
    // if (!role) {
    //   throw new NotFoundException(`El role con ${type} no existe`);
    // }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const { type } = createRoleDto;

    const currentRole = await this.getRoleByType(type);

    if (currentRole) {
      throw new NotFoundException(`El role ${currentRole.type} ya existe`);
    }

    if (!type) {
      return { message: 'El tipo es requerido' };
    }
    const role = this.roleRepository.create({
      type,
    });
    await this.roleRepository.save(role);
    return { message: 'El role fue creado con exito' };
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(createRoleDto);
  }

  findAll() {
    return this.rolesRepository.findAll();
  }

  findOne(id: string) {
    return this.rolesRepository.findOne(id);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  findByName(name: string) {
    return this.rolesRepository.findByName(name);
  }

  async getInvalidRoles(roles: string[]) {
    const invalidRoles = [];
    for (let i = 0; i < roles.length; i++) {
      const id = roles[i];
      const roleExists = await this.findOne(id);
      if (!roleExists) {
        invalidRoles.push(id);
      }
    }
    if (invalidRoles.length > 0) {
      throw new BadRequestException(
        `Los siguientes roles no existen ${invalidRoles.join(', ')}`,
      );
    }
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { hashPassword } from '../../utils/password.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { RolesService } from './../roles/roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject(RolesService)
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let { password } = createUserDto;
    password = await hashPassword(password);
    createUserDto = {
      ...createUserDto,
      password,
    };

    const { roleIds } = createUserDto;
    await this.rolesService.validateRoles(roleIds);
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findAllWithManagerRole() {
    return this.usersRepository.findAllWithManagerRole();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  update(updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findByUsername(email: string) {
    return this.usersRepository.findByUsername(email);
  }

  async validatePassword(
    password: string,
    currentPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(password, currentPassword);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException('El usuario no existe');
    return await this.usersRepository.updateRefreshToken(id, refreshToken);
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    const role = await this.rolesService.findOne(roleId);
    return this.usersRepository.assignRole(userId, role);
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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

  async createWithRole(createUserDto, id) {
    const role = await this.rolesService.findOne(id);
    return this.usersRepository.createWithRole(createUserDto, role);
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    const role = await this.rolesService.findOne(roleId);
    return this.usersRepository.assignRole(userId, role);
  }
}

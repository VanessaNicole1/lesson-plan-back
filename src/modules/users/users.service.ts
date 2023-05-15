import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { hashPassword } from '../../utils/password.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { RolesService } from './../roles/roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { I18nContext } from 'nestjs-i18n';
import { UpdatePasswordDto } from './dto/update-password.dto';
@Injectable()
export class UsersService {

  readonly baseI18nKey = 'users.service';

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

  findAll(filterUserDto?: FilterUserDto) {
    return this.usersRepository.findAll(filterUserDto);
  }

  findAllWithManagerRole() {
    return this.usersRepository.findAllWithManagerRole();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  async findOneByRegisteredToken(registeredToken: string, i18nContext: I18nContext) {
    const user = await this.usersRepository.findOneByRegisteredToken(registeredToken);

    if (!user) {
      throw new NotFoundException(i18nContext.t(`${this.baseI18nKey}.findOneByRegisteredToken.NOT_REGISTERED_USER`));
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto, i18nContext: I18nContext) {
    let { updatedPassword } = updatePasswordDto;
    updatedPassword = await hashPassword(updatedPassword);

    try {
      return this.usersRepository.updatePassword(id, updatedPassword);
    } catch (error) {
      throw new InternalServerErrorException(i18nContext.t(`${this.baseI18nKey}.updatePassword.SOMETHING_WAS_WRONG`));
    }
  }

  async updatePasswordByRegisteredToken(registeredToken: string, updatePasswordDto: UpdatePasswordDto, i18nContext: I18nContext) {
    const user = await this.findOneByRegisteredToken(registeredToken, i18nContext);
    return this.updatePassword(user.id, updatePasswordDto, i18nContext);
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

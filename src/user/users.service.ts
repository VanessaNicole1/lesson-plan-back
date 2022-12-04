import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helpers } from 'src/helpers/helpers';
import { RoleService } from 'src/modules/role/role.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(RoleService)
    private roleService: RoleService,
  ) {}

  async getUserById(id: string): Promise<User> {
    if (!id) {
      throw new NotFoundException(`El usuario no existe`);
    }
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con ${id} no existe`);
    }
    return user;
  }

  async getUserByName(email: string): Promise<User> {
    if (!email) {
      throw new NotFoundException(`El usuario no existe`);
    }
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario no existe`);
    }
    return user;
  }

  async createUser(
    createUserDto: CreateUserDto,
    type: string,
    secondType: string = null,
  ) {
    const role = await this.roleService.getRoleByType(type);
    const { email, name, lastName } = createUserDto;
    const password = Helpers.generatePassword();
    const user = this.userRepository.create({
      email,
      password,
      name,
      lastName,
    });
    user.roles = [role];
    if (secondType) {
      const secondRole = await this.roleService.getRoleByType(secondType);
      user.roles.push(secondRole);
    }
    const currentUser = await this.userRepository.save(user);
    return this.getUserById(currentUser.id);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new NotFoundException(`El id es necesario`);
    }
    const userExist = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userExist) throw new NotFoundException('El usuario no existe');
    if (updateUserDto.name === '') {
      updateUserDto.name = userExist.name;
    }
    if (updateUserDto.lastName === '') {
      updateUserDto.lastName = userExist.lastName;
    }
    if (updateUserDto.email === '') {
      updateUserDto.email = userExist.email;
    }
    const data = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    return this.userRepository.save(data);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    if (!id) {
      throw new NotFoundException(`El id es necesario`);
    }
    const userExist = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userExist) throw new NotFoundException('El usuario no existe');

    await this.userRepository.update(id, { refreshToken: refreshToken });
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new NotFoundException(`El id es necesario`);
    }
    return id;
  }
}

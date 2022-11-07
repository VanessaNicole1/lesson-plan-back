import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helpers } from 'src/helpers/helpers';
import { CreateorUpdateManagerDto } from 'src/manager/dto/create-update-manager.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con ${id} no existe`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, lastName } = createUserDto;
    const password = Helpers.generatePassword();
    const user = this.userRepository.create({
      email,
      password,
      name,
      lastName,
    });
    const currentUser = await this.userRepository.save(user);
    return this.getUserById(currentUser.id);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
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
}

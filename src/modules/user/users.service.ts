import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helpers } from 'src/helpers/helpers';
import { RoleService } from 'src/modules/role/role.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user-entity';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AssignRoleDto } from './dto/assign-role-dto';
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

  async getUserByEmail(email: string): Promise<User> {
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
    return user && user;
  }

  async createUser(createUserDto: CreateUserDto, type: string) {
    const role = await this.roleService.getRoleByType(type);
    if (!role) {
      throw new NotFoundException('El usuario debe tener un rol asignado');
    }
    const { email, name, lastName, password } = createUserDto;
    const currentPassword = !password ? Helpers.generatePassword() : password;
    const user = this.userRepository.create({
      email,
      password: currentPassword,
      name,
      lastName,
      displayName: `${name} ${lastName}`,
    });
    user.roles = [role];
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
    await this.userRepository.update(id, updateUserDto);
    return await this.getUserById(id);
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

  async assignRole(assignRole: AssignRoleDto): Promise<User> {
    const { idRole, idUser } = assignRole;
    const user = await this.getUserById(idUser);
    const currentRole = await this.roleService.getRoleById(idRole);
    user.roles.push(currentRole);
    return await this.userRepository.save(user);
  }

  async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto) {
    // eslint-disable-next-line prefer-const
    let { password, newPassword } = updatePasswordDto;
    if (!password || !newPassword) {
      throw new NotFoundException('La clave es requerida');
    }
    const currentUser = await this.getUserById(user.id);

    const passwordMatches = await bcrypt.compareSync(
      password,
      currentUser.password,
    );
    const salt = await bcrypt.genSalt();
    newPassword = await bcrypt.hash(newPassword, salt);
    if (!passwordMatches) {
      throw new NotFoundException('La clave no es correcta');
    }
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: newPassword })
      .where('id = :id', { id: currentUser.id })
      .execute();

    return this.getUserById(currentUser.id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { name, lastName, email, password } = createUserDto;

    return this.prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password,
        displayName: `${name} ${lastName}`,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    return user;
  }
}

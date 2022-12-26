import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';
import { CreateorUpdateManagerDto } from './dto/create-update-manager.dto';
import { UserService } from 'src/modules/user/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    @Inject(UserService)
    private userService: UserService,
    private config: ConfigService,
  ) {}

  async getManagerById(id: string): Promise<Manager> {
    if (!id) {
      throw new NotFoundException(`El director no existe`);
    }
    const manager = await this.managerRepository.findOne({
      where: {
        id,
      },
      relations: ['degree', 'user', 'user.roles'],
    });

    if (!manager) {
      throw new NotFoundException(`El director con ${id} no existe`);
    }
    return manager;
  }

  async getManagers(): Promise<Manager[]> {
    return await this.managerRepository.find({
      relations: ['degree', 'user', 'user.roles'],
    });
  }

  async createManager(createManagerDto: CreateorUpdateManagerDto) {
    const type = this.config.get('MANAGER_TYPE');
    const user = await this.userService.createUser(createManagerDto, type);
    const manager = this.managerRepository.create({});
    manager.user = user;
    await this.managerRepository.save(manager);
    return { message: 'El director fue creado con éxito' };
  }

  async updateManager(id: string, updateManagerDto: CreateorUpdateManagerDto) {
    if (!id) {
      throw new NotFoundException(`El director no existe`);
    }
    const managerExist = await this.getManagerById(id);

    if (!managerExist) throw new NotFoundException('El director no existe');

    const user = await this.userService.getUserById(managerExist.user.id);
    await this.userService.updateUser(user.id, updateManagerDto);
    return await this.getManagerById(id);
  }

  async deleteManager(id: string) {
    if (!id) {
      throw new NotFoundException(`El director no existe`);
    }
    const result = await this.managerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El director con ${id} no existe`);
    }

    return { message: 'El director fue eliminado con éxito' };
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';
import { CreateorUpdateManagerDto } from './dto/create-update-manager.dto';
import { UserService } from 'src/user/users.service';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    @Inject(UserService)
    private userService: UserService,
  ) {}

  async getManagerById(id: string): Promise<Manager> {
    const manager = await this.managerRepository.findOne({
      where: {
        id,
      },
    });

    if (!manager) {
      throw new NotFoundException(`El director con ${id} no existe`);
    }
    return manager;
  }

  async createManager(createManagerDto: CreateorUpdateManagerDto) {
    const user = await this.userService.createUser(createManagerDto);
    const manager = this.managerRepository.create({});
    manager.user = user;
    await this.managerRepository.save(manager);
    return { message: 'Manager created successfully' };
  }

  async updateManager(id: string, updateManagerDto: CreateorUpdateManagerDto) {
    const managerExist = await this.managerRepository.findOne({
      where: {
        id,
      },
    });
    if (!managerExist) throw new NotFoundException('Director no existe');

    const user = await this.userService.getUserById(managerExist.user.id);
    await this.userService.updateUser(user.id, updateManagerDto);
    return await this.managerRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteManager(id: string): Promise<void> {
    const result = await this.managerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El director con ${id} no existe`);
    }
  }
}

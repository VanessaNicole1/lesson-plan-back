import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';
import { CreateorUpdateManagerDto } from './dto/create-update-manager.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
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
    const { email } = createManagerDto;
    const manager = this.managerRepository.create({
      email,
    });
    await this.managerRepository.save(manager);
  }

  async updateManager(updateManagerDto: CreateorUpdateManagerDto) {
    return updateManagerDto;
  }
}

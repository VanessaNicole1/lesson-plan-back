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

  async updateManager(id: string, updateManagerDto: CreateorUpdateManagerDto) {
    const managerExist = await this.managerRepository.findOne({
      where: {
        id,
      },
    });
    if (!managerExist) throw new NotFoundException('Director no existe');
    if (updateManagerDto.email === '') {
      updateManagerDto.email = managerExist.email;
    }
    await this.managerRepository.update(id, updateManagerDto);
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

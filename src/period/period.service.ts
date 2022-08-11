import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './period.entity';
import { CreatePeriodDto } from './dto/create-period-dto';
import { UpdatePeriodDto } from './dto/update-period-dto';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private periodsRepository: Repository<Period>,
  ) {}

  async getPeriodById(id: string): Promise<Period> {
    const period = await this.periodsRepository.findOne({
      where: {
        id,
      },
    });

    if (!period) {
      throw new NotFoundException(`El periodo con ${id} no existe`);
    }
    return period;
  }

  async getAllPeriod(): Promise<Period[]> {
    return await this.periodsRepository.find();
  }

  async createPeriod(createPeriodDto: CreatePeriodDto) {
    const { name, startDate, endDate } = createPeriodDto;
    const period = this.periodsRepository.create({
      name,
      startDate,
      endDate,
    });
    await this.periodsRepository.save(period);
  }

  async updatePeriod(id: string, updatePeriodDto: UpdatePeriodDto) {
    const periodExist = await this.periodsRepository.findOne({
      where: {
        id,
      },
    });
    if (!periodExist) throw new NotFoundException('Docente no existe');
    if (updatePeriodDto.name === '') {
      updatePeriodDto.name = periodExist.name;
    }
    if (updatePeriodDto.startDate.toString() === '') {
      updatePeriodDto.startDate = periodExist.startDate;
    }
    if (updatePeriodDto.endDate.toString() === '') {
      updatePeriodDto.endDate = periodExist.endDate;
    }
    await this.periodsRepository.update(id, updatePeriodDto);
    return await this.periodsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deletePeriod(id: string): Promise<void> {
    const result = await this.periodsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El periodo con ${id} no existe`);
    }
  }
}

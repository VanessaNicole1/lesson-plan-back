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
    if (!id) {
      throw new NotFoundException(`El periodo no existe`);
    }
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
    const { startDate, endDate } = createPeriodDto;
    if (!startDate || !startDate) {
      throw new NotFoundException(
        'Las fechas del periodo academico son requeridas',
      );
    }
    const period = this.periodsRepository.create({
      startDate,
      endDate,
    });
    return await this.periodsRepository.save(period);
  }

  async updatePeriod(id: string, updatePeriodDto: UpdatePeriodDto) {
    if (!id) {
      throw new NotFoundException(`El periodo no existe`);
    }
    const periodExist = await this.periodsRepository.findOne({
      where: {
        id,
      },
    });
    if (!periodExist) throw new NotFoundException('Periodo no existe');
    if (updatePeriodDto.startDate === '') {
      updatePeriodDto.startDate = periodExist.startDate;
    }
    if (updatePeriodDto.endDate === '') {
      updatePeriodDto.endDate = periodExist.endDate;
    }
    await this.periodsRepository.update(id, updatePeriodDto);
    return await this.periodsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deletePeriod(id: string) {
    if (!id) {
      throw new NotFoundException(`El periodo no existe`);
    }
    const result = await this.periodsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El periodo con ${id} no existe`);
    }
    return { message: 'El periodo fue eliminado con éxito' };
  }
}

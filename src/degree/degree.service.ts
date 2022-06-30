import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Degree } from './degree.entity';
import { CreateDegreeDto } from './dto/create-degree-dto';
import { UpdateDegreeDto } from './dto/update-degree-dto';

@Injectable()
export class DegreeService {
  constructor(
    @InjectRepository(Degree)
    private degreesRepository: Repository<Degree>,
  ) {}

  async getDegreeById(id: string): Promise<Degree> {
    const degree = await this.degreesRepository.findOne({
      where: {
        id,
      },
    });

    if (!degree) {
      throw new NotFoundException(`La carrera con ${id} no existe`);
    }
    return degree;
  }

  async createDegree(createPeriodDto: CreateDegreeDto) {
    const { name } = createPeriodDto;
    const degree = this.degreesRepository.create({
      name,
    });
    await this.degreesRepository.save(degree);
  }

  async updateDegree(updateDegreeDto: UpdateDegreeDto) {
    return updateDegreeDto;
  }

  async deleteDegree(id: string): Promise<void> {
    const result = await this.degreesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La carrera con ${id} no existe`);
    }
  }
}

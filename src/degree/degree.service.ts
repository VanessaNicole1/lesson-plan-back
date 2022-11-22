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
    if (!id) {
      throw new NotFoundException(`La carrera no existe`);
    }
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

  async getGradesByDegree(id: string) {
    if (!id) {
      throw new NotFoundException(`La carrera no existe`);
    }
    const data = await this.degreesRepository.find({
      relations: ['grades'],
    });
    for (let i = 0; i < data.length; i++) {
      const degree_id = data[i].id;
      if (id === degree_id) {
        const degree_grades = data[i];
        if (degree_grades.grades.length < 0) {
          throw new NotFoundException(
            `El profesor con ${id} no tiene materias registradas`,
          );
        }
        return degree_grades;
      }
    }
  }

  async createDegree(createPeriodDto: CreateDegreeDto) {
    const { name } = createPeriodDto;
    const degree = this.degreesRepository.create({
      name,
    });
    await this.degreesRepository.save(degree);
  }

  async deleteDegree(id: string): Promise<void> {
    if (!id) {
      throw new NotFoundException(`La carrera no existe`);
    }
    const result = await this.degreesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La carrera con ${id} no existe`);
    }
  }

  async updateDegree(id: string, updateDegreeDto: UpdateDegreeDto) {
    if (!id) {
      throw new NotFoundException(`La carrera no existe`);
    }
    const degreeExist = await this.degreesRepository.findOne({
      where: {
        id,
      },
    });
    if (!degreeExist) throw new NotFoundException('Docente no existe');
    if (updateDegreeDto.name === '') {
      updateDegreeDto.name = degreeExist.name;
    }

    const { grades } = updateDegreeDto;
    const data = await this.degreesRepository.preload({
      id,
      ...updateDegreeDto,
      grades,
    });
    return this.degreesRepository.save(data);
  }
}

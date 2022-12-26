import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade-dto';
import { UpdateGradeDto } from './dto/update-grade-dto';
import { Grade } from './grade.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const { numberParallel, parallel } = createGradeDto;
    const currentGrade = await this.verifyGradeExist(numberParallel, parallel);
    if (currentGrade) {
      return currentGrade;
    }
    const grade = this.gradesRepository.create({
      numberParallel,
      parallel,
      displayName: `${numberParallel} ${parallel}`,
    });
    return await this.gradesRepository.save(grade);
  }

  async getGradeById(id: string): Promise<Grade> {
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
    const grade = await this.gradesRepository.findOne({
      where: {
        id,
      },
      relations: ['students', 'degree', 'schedule'],
    });

    if (!grade) {
      throw new NotFoundException(`El curso con ${id} no existe`);
    }
    return grade;
  }

  async getAllGrade(): Promise<Grade[]> {
    return await this.gradesRepository.find({
      relations: ['students', 'degree', 'schedule'],
    });
  }

  async getGradeByNameAndParallel(
    numberParallel: number,
    parallel: string,
  ): Promise<Grade> {
    if (!numberParallel || !parallel) {
      throw new NotFoundException(`La carrera no existe`);
    }
    const grade = await this.gradesRepository.findOne({
      where: {
        numberParallel,
        parallel,
      },
    });
    if (!grade) {
      throw new NotFoundException(
        `El curso ${numberParallel}${parallel} no existe`,
      );
    }
    return grade;
  }

  async verifyGradeExist(numberParallel: number, parallel: string) {
    if (!numberParallel || !parallel) {
      throw new NotFoundException(`El curso no existe`);
    }
    const grade = await this.gradesRepository.findOne({
      where: {
        numberParallel,
        parallel,
      },
    });
    return grade;
  }

  async updateGrade(id: string, updateGradeDto: UpdateGradeDto) {
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
    const gradeExist = await this.getGradeById(id);
    if (!gradeExist) throw new NotFoundException('El curso no existe');

    const { numberParallel, parallel } = updateGradeDto;

    updateGradeDto.numberParallel = !numberParallel
      ? gradeExist.numberParallel
      : numberParallel;
    updateGradeDto.parallel = !parallel ? gradeExist.parallel : parallel;

    const gradeExists = await this.verifyGradeExist(
      updateGradeDto.numberParallel,
      updateGradeDto.parallel,
    );

    if (gradeExists) {
      return {
        message: `El curso ${updateGradeDto.numberParallel} ${updateGradeDto.parallel} ya existe`,
      };
    }
    await this.gradesRepository.update(id, updateGradeDto);
    return this.getGradeById(id);
  }

  async deleteGrade(id: string) {
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El curso con ${id} no existe`);
    }
    return { message: 'El curso fue eliminado con éxito' };
  }
}

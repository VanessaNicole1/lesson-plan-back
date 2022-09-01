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

  async getGradeById(id: string): Promise<Grade> {
    const grade = await this.gradesRepository.findOne({
      where: {
        id,
      },
    });

    if (!grade) {
      throw new NotFoundException(`El curso con ${id} no existe`);
    }
    return grade;
  }

  async getAllGrade(): Promise<Grade[]> {
    return await this.gradesRepository.find();
  }

  async getGradeByNameAndParallel(
    number: number,
    parallel: string,
  ): Promise<Grade> {
    const grade = await this.gradesRepository.findOne({
      where: {
        number,
        parallel,
      },
    });
    if (!grade) {
      throw new NotFoundException(`El curso ${number}${parallel} no existe`);
    }
    return grade;
  }

  async verifyGradeExist(number: number, parallel: string) {
    const grade = await this.gradesRepository.findOne({
      where: {
        number,
        parallel,
      },
    });
    return grade;
  }

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const { number, parallel } = createGradeDto;
    const grade = this.gradesRepository.create({
      number,
      parallel,
    });
    await this.gradesRepository.save(grade);
    return grade;
  }

  async updateTeacher(id: string, updateGradeDto: UpdateGradeDto) {
    const gradeExist = await this.gradesRepository.findOne({
      where: {
        id,
      },
    });
    if (!gradeExist) throw new NotFoundException('Curso no existe');
    if (updateGradeDto.number.toString() === '') {
      updateGradeDto.number = gradeExist.number;
    }
    if (updateGradeDto.parallel === '') {
      updateGradeDto.parallel = gradeExist.parallel;
    }
    await this.gradesRepository.update(id, updateGradeDto);
    return await this.gradesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteGrade(id: string): Promise<void> {
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El curso con ${id} no existe`);
    }
  }
}

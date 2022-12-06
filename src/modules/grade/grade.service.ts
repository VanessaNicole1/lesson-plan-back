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
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
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

  async getSubjectsByGrade(id: string) {
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
    const data = await this.gradesRepository.find({
      relations: ['subjects'],
    });
    for (let i = 0; i < data.length; i++) {
      const grade_id = data[i].id;
      if (id === grade_id) {
        const grades_subject = data[i];
        if (grades_subject.subjects.length < 0) {
          throw new NotFoundException(
            `El curso con ${id} no tiene materias registradas`,
          );
        }
        return grades_subject;
      }
    }
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

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const { numberParallel, parallel } = createGradeDto;
    const currentGrade = await this.verifyGradeExist(numberParallel, parallel);
    if (currentGrade) {
      return currentGrade;
    }
    const grade = this.gradesRepository.create({
      numberParallel,
      parallel,
    });
    return await this.gradesRepository.save(grade);
  }

  async updateGrade(id: string, updateGradeDto: UpdateGradeDto) {
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
    const gradeExist = await this.gradesRepository.findOne({
      where: {
        id,
      },
    });
    if (!gradeExist) throw new NotFoundException('Curso no existe');
    if (updateGradeDto.number.toString() === '') {
      updateGradeDto.number = gradeExist.numberParallel;
    }
    if (updateGradeDto.parallel === '') {
      updateGradeDto.parallel = gradeExist.parallel;
    }
    const { subjects } = updateGradeDto;
    const data = await this.gradesRepository.preload({
      id,
      ...updateGradeDto,
      subjects,
    });
    return this.gradesRepository.save(data);
  }

  async deleteGrade(id: string): Promise<void> {
    if (!id) {
      throw new NotFoundException(`El curso no existe`);
    }
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El curso con ${id} no existe`);
    }
  }
}

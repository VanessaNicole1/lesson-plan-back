import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { UpdateSubjectDto } from './dto/update-subject-dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async getSubjectById(id: string): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new NotFoundException(`El profesor con ${id} no existe`);
    }
    return subject;
  }

  async getAllSubjects(): Promise<Subject[]> {
    return await this.subjectsRepository.find();
  }

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const { name } = createSubjectDto;
    const subject = this.subjectsRepository.create({
      name,
    });
    await this.subjectsRepository.save(subject);
  }

  async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subjectExist = await this.subjectsRepository.findOne({
      where: {
        id,
      },
    });
    if (!subjectExist) throw new NotFoundException('Materia no existe');
    //const { name } = updateSubjectDto;
    if (updateSubjectDto.name === '') {
      updateSubjectDto.name = subjectExist.name;
    }
    await this.subjectsRepository.update(id, updateSubjectDto);
    return await this.subjectsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteSubject(id: string): Promise<void> {
    const result = await this.subjectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La materia con ${id} no existe`);
    }
  }
}

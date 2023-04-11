import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { FilterSubjectDto } from './dto/filter-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsRepository } from './subjects.repository';

@Injectable()
export class SubjectsService {
  constructor(private subjectsRepository: SubjectsRepository) {}

  create(createSubjectDto: CreateSubjectDto) {
    return 'This action adds a new subject';
  }

  findAll(filterSubjectDto?: FilterSubjectDto) {
    return this.subjectsRepository.findAll(filterSubjectDto);
  }

  findOne(id: string) {
    return this.subjectsRepository.findOne(id);
  }

  update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsRepository.update(id, updateSubjectDto);
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}

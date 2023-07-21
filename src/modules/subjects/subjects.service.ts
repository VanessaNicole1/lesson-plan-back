import { Injectable } from '@nestjs/common';
import { FilterSubjectDto } from './dto/filter-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsRepository } from './subjects.repository';

@Injectable()
export class SubjectsService {
  constructor(private subjectsRepository: SubjectsRepository) {}

  findAll(filterSubjectDto?: FilterSubjectDto) {
    return this.subjectsRepository.findAll(filterSubjectDto);
  }

  findOne(id: string) {
    return this.subjectsRepository.findOne(id);
  }

  update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsRepository.update(id, updateSubjectDto);
  }

  removeSubjectsByPeriod(idPeriod: string) {
    return this.subjectsRepository.removeSubjectsByPeriod(idPeriod);
  }
}

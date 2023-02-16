import { Injectable } from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { LessonPlansRepository } from './lesson-plans.repository';

@Injectable()
export class LessonPlansService {
  constructor (private lessonPlansRepository: LessonPlansRepository) {} 

  create(createLessonPlanDto: CreateLessonPlanDto) {
    return 'This action adds a new lessonPlan';
  }

  findAll() {
    return this.lessonPlansRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonPlan`;
  }

  update(id: number, updateLessonPlanDto: UpdateLessonPlanDto) {
    return `This action updates a #${id} lessonPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonPlan`;
  }
}

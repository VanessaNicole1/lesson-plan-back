import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonPlanDto } from './dto/create-lesson-plan-dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan-dto';
import { LessonPlan } from './lesson-plan.entity';

@Injectable()
export class LessonPlanService {
  constructor(
    @InjectRepository(LessonPlan)
    private LessonPlanRepository: Repository<LessonPlan>,
  ) {}

  async getLessonPlanById(id: string): Promise<LessonPlan> {
    const lessonPlan = await this.LessonPlanRepository.findOne({
      where: {
        id,
      },
    });

    if (!lessonPlan) {
      throw new NotFoundException(`El plan de clases con ${id} no existe`);
    }
    return lessonPlan;
  }

  async createLessonPlan(createLessonPlanDto: CreateLessonPlanDto) {
    const { date, grade, topic, content, comment } = createLessonPlanDto;
    const lesson = this.LessonPlanRepository.create({
      date,
      grade,
      topic,
      content,
      comment,
    });
    await this.LessonPlanRepository.save(lesson);
  }

  async updateLessonPlan(updateLessonPlanDto: UpdateLessonPlanDto) {
    return updateLessonPlanDto;
  }

  async deleteLessonPlan(id: string): Promise<void> {
    const result = await this.LessonPlanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El plan de clases con ${id} no existe`);
    }
  }
}

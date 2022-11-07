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

  async getAllLessonPlanByTeacher(teacher_id: string): Promise<LessonPlan[]> {
    return await this.LessonPlanRepository.find({
      where: {
        teacher: {
          id: teacher_id,
        },
      },
    });
  }

  async getAllLessonPlanBySubject(subject_id: string): Promise<LessonPlan[]> {
    return await this.LessonPlanRepository.find({
      where: {
        subject: {
          id: subject_id,
        },
      },
    });
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

  async updateLessonPlan(id: string, updateLessonPlan: UpdateLessonPlanDto) {
    const lessonPlanExist = await this.LessonPlanRepository.findOne({
      where: {
        id,
      },
    });
    if (!lessonPlanExist)
      throw new NotFoundException('Plan de Clases no existe');
    if (updateLessonPlan.date.toString() === '') {
      updateLessonPlan.date = lessonPlanExist.date;
    }
    if (updateLessonPlan.grade === '') {
      updateLessonPlan.grade = lessonPlanExist.grade;
    }
    if (updateLessonPlan.topic === '') {
      updateLessonPlan.topic = lessonPlanExist.topic;
    }
    if (updateLessonPlan.content === '') {
      updateLessonPlan.content = lessonPlanExist.content;
    }
    if (updateLessonPlan.comment === '') {
      updateLessonPlan.comment = lessonPlanExist.comment;
    }
    await this.LessonPlanRepository.update(id, updateLessonPlan);
    return await this.LessonPlanRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteLessonPlan(id: string): Promise<void> {
    const result = await this.LessonPlanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El plan de clases con ${id} no existe`);
    }
  }
}

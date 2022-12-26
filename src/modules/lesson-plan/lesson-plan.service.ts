import { StudentLessonPlanService } from './../student-lesson-plan/student-lesson-plan.service';
import { ScheduleService } from './../schedule/schedule.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonPlanDto } from './dto/create-lesson-plan-dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan-dto';
import { LessonPlan } from './lesson-plan.entity';
import { AssignStudentToLessonDto } from '../student-lesson-plan/dto/assign-student-lesson.dto';
@Injectable()
export class LessonPlanService {
  constructor(
    @InjectRepository(LessonPlan)
    private LessonPlanRepository: Repository<LessonPlan>,
    @Inject(ScheduleService)
    private scheduleService: ScheduleService,
    @Inject(forwardRef(() => StudentLessonPlanService))
    private studentLessonPlanService: StudentLessonPlanService,
  ) {}

  async getLessonPlanById(id: string): Promise<LessonPlan> {
    if (!id) {
      throw new NotFoundException(`El plan de clase no existe`);
    }
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

  async createLessonPlan(
    createLessonPlanDto: CreateLessonPlanDto,
    idSchedule: string,
    user: any,
  ) {
    if (!idSchedule) {
      throw new NotFoundException(`El plan de clase no existe`);
    }

    const schedule = await this.scheduleService.getScheduleById(idSchedule);
    const userId = schedule.teacher.user.id;
    if (user.id !== userId) {
      throw new NotFoundException('Petición denegada');
    }
    const { date, topic, content, comment, ids } = createLessonPlanDto;

    if (ids.length === 0) {
      throw new NotFoundException(
        'El plan de clases debe tener al menos 1 revisor',
      );
    }

    const lesson = this.LessonPlanRepository.create({
      date,
      topic,
      content,
      comment,
    });
    lesson.schedule = schedule;

    const lessonPlan = await this.LessonPlanRepository.save(lesson);

    for (let i = 0; i < ids.length; i++) {
      const studentId = ids[i];
      const lessonId = lessonPlan.id;
      const assignStudentLesson: AssignStudentToLessonDto = {
        idStudent: studentId,
        idLessonPlan: lessonId,
      };
      await this.studentLessonPlanService.assignStudentsToLessonPlan(
        assignStudentLesson,
      );
    }
    return { message: 'El plan de clases fue creado con éxito' };
  }

  async updateLessonPlan(id: string, updateLessonPlan: UpdateLessonPlanDto) {
    if (!id) {
      throw new NotFoundException(`El plan de clase no existe`);
    }
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
    if (!id) {
      throw new NotFoundException(`El plan de clase no existe`);
    }
    const result = await this.LessonPlanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El plan de clases con ${id} no existe`);
    }
  }

  async findAll() {
    return await this.LessonPlanRepository.find({
      relations: [
        'schedule',
        'schedule.teacher.user',
        'schedule.grade',
        'schedule.subject',
      ],
    });
  }
}

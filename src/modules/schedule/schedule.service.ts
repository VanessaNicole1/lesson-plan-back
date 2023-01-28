import { SubjectsService } from './../subjects/subjects.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GradeService } from '../grade/grade.service';
import { TeachersService } from '../teachers/teachers.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schedule.entity';
import { User } from '../user/user-entity';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @Inject(GradeService)
    private gradeService: GradeService,
    @Inject(TeachersService)
    private teacherService: TeachersService,
    @Inject(SubjectsService)
    private subjectService: SubjectsService,
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto, id: string) {
    if (!id) {
      throw new NotFoundException(`El id es requerido`);
    }
    const { startHour, endHour, day, gradeId, subjectId } = createScheduleDto;
    const grade = await this.gradeService.getGradeById(gradeId);
    const subject = await this.subjectService.getSubjectById(subjectId);
    const teacher = await this.teacherService.getTeacherByUserId(id);
    const schedule = this.scheduleRepository.create({
      startHour,
      endHour,
      day,
    });
    schedule.grade = grade;
    schedule.subject = subject;
    schedule.teacher = teacher;
    await this.scheduleRepository.save(schedule);
    return { message: 'El horario se ha creado con éxito' };
  }

  async getScheduleById(id: string) {
    if (!id) {
      throw new NotFoundException(`El id es requerido`);
    }
    return await this.scheduleRepository.findOne({
      where: {
        id,
      },
      relations: ['grade', 'subject', 'teacher', 'teacher.user', 'lessonPlans'],
    });
  }

  async getScheduleByTeacher(id: string) {
    if (!id) {
      throw new NotFoundException(`El id es requerido`);
    }
    const teacher = await this.teacherService.getTeacherByUserId(id);
    return await this.scheduleRepository.find({
      where: {
        teacher: {
          id: teacher.id,
        },
      },
      relations: ['grade', 'subject', 'teacher', 'lessonPlans'],
    });
  }

  async deleteSchedule(idSchedule: string, user: User) {
    if (!idSchedule) {
      throw new NotFoundException(`El calendario no existe`);
    }
    const schedule = await this.getScheduleById(idSchedule);
    const userId = schedule.teacher.user.id;
    if (user.id !== userId) {
      throw new NotFoundException('Petición denegada');
    }
    const result = await this.scheduleRepository.delete(idSchedule);
    if (result.affected === 0) {
      throw new NotFoundException(`El calendario con ${idSchedule} no existe`);
    }
    return { message: 'El calendario ha sido eliminado con éxito' };
  }

  async updateSchedule(
    idSchedule: string,
    user: User,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    if (!idSchedule) {
      throw new NotFoundException(`El calendario no existe`);
    }
    const schedule = await this.getScheduleById(idSchedule);
    const userId = schedule.teacher.user.id;
    if (user.id !== userId) {
      throw new NotFoundException('Petición denegada');
    }

    let { startHour, endHour, day } = updateScheduleDto;

    const { gradeId, subjectId } = updateScheduleDto;

    startHour = !startHour ? schedule.startHour : startHour;
    endHour = !endHour ? schedule.endHour : endHour;
    day = !day ? schedule.day : day;
    const grade = gradeId && (await this.gradeService.getGradeById(gradeId));
    const subject =
      subjectId && (await this.subjectService.getSubjectById(subjectId));

    await this.scheduleRepository.update(idSchedule, {
      startHour,
      endHour,
      day,
      grade,
      subject,
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { LessonPlansRepository } from './lesson-plans.repository';
import { SchedulesService } from '../schedules/schedules.service';
import * as fs from 'fs'

@Injectable()
export class LessonPlansService {
  constructor (private lessonPlansRepository: LessonPlansRepository, private scheduleService: SchedulesService) {}

  findAll() {
    return this.lessonPlansRepository.findAll();
  }

  findOne(id: string) {
    return this.lessonPlansRepository.findOne(id);
  }

  findLessonPlanBySchedule(scheduleId: string) {
    return this.lessonPlansRepository.findLessonPlanBySchedule(scheduleId);
  }

  async create(createLessonPlanDto: CreateLessonPlanDto, files: Array<Express.Multer.File>) {
    const resources = [];
    for (let i = 0; i < files.length; i++) {
      resources.push(files[i].filename);
    }
    createLessonPlanDto['resources'] = resources;
    const { scheduleId } = createLessonPlanDto;
    const currentSchedule = await this.scheduleService.findOne(scheduleId);
    createLessonPlanDto = {
      ...createLessonPlanDto,
      scheduleId: currentSchedule.id,
    }
    return this.lessonPlansRepository.create(createLessonPlanDto);
  }

  update(id: string, updateLessonPlanDto: UpdateLessonPlanDto) {
    return this.lessonPlansRepository.update(id, updateLessonPlanDto);
  }

  async remove(id: string) {
    const lessonPlan = await this.findOne(id);
    const validationsTracking = lessonPlan.validationsTracking;
    const validatedLessonPlans = validationsTracking.filter((tracking) => tracking.isValidated === true);
    if (validatedLessonPlans.length > 0) {
      throw new BadRequestException('El plan de clases no puede ser eliminado ya que ya tiene una validación por parte de un estudiante')
    }
    const resources = lessonPlan.resources;
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      fs.unlinkSync(`./uploads/${resource}`);
    }
    return this.lessonPlansRepository.remove(id);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { LessonPlansRepository } from './lesson-plans.repository';
import { SchedulesService } from '../schedules/schedules.service';
import * as fs from 'fs';
import { LessonPlansTrackingService } from '../lesson-plan-validation-tracking/lesson-plan-tracking.service';
import { SendEmailService } from '../common/services/send-email.service';
import { DeleteResourceDto } from './dto/delete-resource.dto';

@Injectable()
export class LessonPlansService {
  constructor(
    private lessonPlansRepository: LessonPlansRepository,
    private scheduleService: SchedulesService,
    private lessonPlansTrackingService: LessonPlansTrackingService,
    private emailService: SendEmailService,
  ) {}

  findAll() {
    return this.lessonPlansRepository.findAll();
  }

  findOne(id: string) {
    return this.lessonPlansRepository.findOne(id);
  }

  findLessonPlanBySchedule(scheduleId: string) {
    return this.lessonPlansRepository.findLessonPlanBySchedule(scheduleId);
  }

  async create(
    createLessonPlanDto: CreateLessonPlanDto,
    files: Array<Express.Multer.File>,
  ) {
    const { students, notification } = createLessonPlanDto;
    const resources = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resource = {
        name: file.originalname,
        url: file.filename,
        createdDate: new Date(),
        size: file.size
      }
      resources.push(resource);
    }
    createLessonPlanDto['resources'] = resources;
    const { scheduleId } = createLessonPlanDto;
    const currentSchedule = await this.scheduleService.findOne(scheduleId);
    if (notification === 'yes') {
      delete createLessonPlanDto.notificationDate
    }
    createLessonPlanDto = {
      ...createLessonPlanDto,
      scheduleId: currentSchedule.id,
    };

    const lessonPlanCreated = await this.lessonPlansRepository.create(
      createLessonPlanDto,
    );

    if (lessonPlanCreated) {
      await this.lessonPlansTrackingService.create({
        lessonPlanId: lessonPlanCreated.id,
        students,
        periodId: createLessonPlanDto.periodId
      });
    }

    // TODO: Notify the grading of the lesson plan
    if (notification === 'yes') {
      // return this.emailService.sendEmail();
    } else {
      // return;
    }

    return lessonPlanCreated;
  }

  update(
    id: string,
    updateLessonPlanDto: UpdateLessonPlanDto,
    files: Array<Express.Multer.File>,
  ) {
    const resources = [];
    for (let i = 0; i < files.length; i++) {
      resources.push(files[i].filename);
    }
    updateLessonPlanDto['resources'] = resources;
    return this.lessonPlansRepository.update(id, updateLessonPlanDto);
  }

  async remove(id: string) {
    const lessonPlan = await this.findOne(id);
    const validationsTracking = lessonPlan.validationsTracking;
    const validatedLessonPlans = validationsTracking.filter(
      (tracking) => tracking.isValidated === true,
    );
    if (validatedLessonPlans.length > 0) {
      throw new BadRequestException(
        'El plan de clases no puede ser eliminado ya que ya tiene una validación por parte de un estudiante',
      );
    }
    const resources = lessonPlan.resources as any[];
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i].url;
      fs.unlinkSync(`./uploads/${resource}`);
    }
    return this.lessonPlansRepository.remove(id);
  }

  // async removeResource(id: string, deleteResourceDto: DeleteResourceDto) {
  //   const { name } = deleteResourceDto;
  //   const lessonPlan = await this.findOne(id);
  //   const resources = lessonPlan.resources;
  //   const currentResources = resources.filter((resource) => resource !== name);
  //   await this.lessonPlansRepository.removeResource(id, currentResources);
  //   await fs.unlinkSync(`./uploads/${name}`);
  // }
}

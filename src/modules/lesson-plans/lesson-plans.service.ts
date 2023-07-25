import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { LessonPlansRepository } from './lesson-plans.repository';
import { SchedulesService } from '../schedules/schedules.service';
import * as fs from 'fs';
import { LessonPlansTrackingService } from '../lesson-plan-validation-tracking/lesson-plan-tracking.service';
import { DeleteResourceDto } from './dto/delete-resource.dto';
import { StudentValidateLessonPlanEmail } from '../common/strategies/email/student/validate-lesson-plan.strategy';
import { PeriodsService } from '../periods/periods.service';
import { TeachersService } from '../teachers/teachers.service';
import { LessonPlanReportDto } from '../common/dto/lesson-plan-report.dto';
import { ReportsService } from '../common/services/reports.service';
import { SendEmailServiceWrapper } from '../common/services/send-email-wrapper.service';
import { StudentChangeDateToValidateLessonPlanEmail } from '../common/strategies/email/student/change-date-to-validate-lesson-plan.strategy';

@Injectable()
export class LessonPlansService {
  constructor(
    private lessonPlansRepository: LessonPlansRepository,
    private scheduleService: SchedulesService,
    private lessonPlansTrackingService: LessonPlansTrackingService,
    private periodService: PeriodsService,
    private emailService: SendEmailServiceWrapper,
    private teacherService: TeachersService,
    private reportService: ReportsService,
  ) {}

  findAll() {
    return this.lessonPlansRepository.findAll();
  }

  async findOne(id: string) {
    const lessonPlan = await this.lessonPlansRepository.findOne(id);

    if (!lessonPlan) {
      throw new NotFoundException(
        `Plan de clases con id "${id}" no encontrado`,
      );
    }

    return lessonPlan;
  }

  async findOneWithPeriod(id: string) {
    const lessonPlan = await this.lessonPlansRepository.findOneWithPeriod(id);

    if (!lessonPlan) {
      throw new NotFoundException(
        `Plan de clases con id "${id}" no encontrado`,
      );
    }

    return lessonPlan;
  }

  findLessonPlanBySchedule(scheduleId: string) {
    return this.lessonPlansRepository.findLessonPlanBySchedule(scheduleId);
  }

  async create(
    createLessonPlanDto: CreateLessonPlanDto,
    files: Array<Express.Multer.File>,
  ) {
    const { students, notification, periodId, date, deadlineDate } =
      createLessonPlanDto;
    const resources = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resource = {
        name: file.originalname,
        url: file.filename,
        createdDate: new Date(),
        size: file.size,
      };
      resources.push(resource);
    }
    createLessonPlanDto['resources'] = resources;
    const { scheduleId } = createLessonPlanDto;
    const currentSchedule = await this.scheduleService.findOne(scheduleId);
    if (notification === 'yes') {
      delete createLessonPlanDto.notificationDate;
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
        periodId: createLessonPlanDto.periodId,
      });
    }

    if (notification === 'yes') {
      const currentPeriod = await this.periodService.findOne(periodId);
      const periodDisplayName = currentPeriod.displayName;
      const subjectName = currentSchedule.subject.name;
      const teacherName = currentSchedule.teacher.user.displayName;
      const lessonPlanDate = new Date(date);
      const spanishLessonPlanDate = lessonPlanDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const spanishMaxValidationLessonPlanDate = new Date(deadlineDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const lessonPlansTracking = await this.lessonPlansTrackingService.findLessonPlanTrackingByLessonPlanId(
        lessonPlanCreated.id,
      );
      for (let i = 0; i < lessonPlansTracking.length; i++) {
        const lessonPlanTracking = lessonPlansTracking[i];
        const studentDisplayName = lessonPlanTracking.student.user.displayName;
        const validateLessonPlanEmail = new StudentValidateLessonPlanEmail(
          periodDisplayName,
          studentDisplayName,
          subjectName,
          teacherName,
          spanishLessonPlanDate,
          spanishMaxValidationLessonPlanDate,
        );
        this.emailService.sendEmail(validateLessonPlanEmail, lessonPlanTracking.student.user.email);
      }
    } else {
      // TODO: Notify students with the specific date
      // return;
    }

    return lessonPlanCreated;
  }

  async update(
    id: string,
    updateLessonPlanDto: UpdateLessonPlanDto,
    files: Array<Express.Multer.File>,
  ) {
    const currentLessonPlan = await this.findOne(id);
    const { students, deadlineNotification, periodId } = updateLessonPlanDto;
    const resources = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resource = {
        name: file.originalname,
        url: file.filename,
        createdDate: new Date(),
        size: file.size,
      };
      resources.push(resource);
    }
    const lessonPlanResources = currentLessonPlan.resources as any[];
    let newResources = [];
    if (lessonPlanResources && lessonPlanResources.length > 0) {
      newResources = [...resources, ...lessonPlanResources];
      resources.push(lessonPlanResources);
      updateLessonPlanDto['resources'] = newResources;
    } else {
      updateLessonPlanDto['resources'] = resources;
    }

    const lessonPlanUpdated = await this.lessonPlansRepository.update(
      id,
      updateLessonPlanDto,
    );

    // TODO: Is it necessary to notify again that the teacher has updated the information?

    if (deadlineNotification === 'yes') {
      const currentPeriod = await this.periodService.findOne(periodId);
      const periodDisplayName = currentPeriod.displayName;
      const displayNameTeacher = lessonPlanUpdated.schedule.teacher.user.displayName;
      const subjectName = lessonPlanUpdated.schedule.subject.name;
      const lessonPlanDate = new Date(lessonPlanUpdated.date);
      const spanishLessonPlanDate = lessonPlanDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const maxValidationLessonPlanDate = lessonPlanUpdated.maximumValidationDate;
      const spanishMaxValidationLessonPlanDate = maxValidationLessonPlanDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const lessonPlansTracking = await this.lessonPlansTrackingService.findLessonPlanTrackingByLessonPlanId(
        lessonPlanUpdated.id,
      );
      const lessonPlansTrackingNoValidated = lessonPlansTracking.filter((lessonPlanTracking) => !lessonPlanTracking.isValidated);
      for (let i = 0; i < lessonPlansTrackingNoValidated.length; i++) {
        const lessonPlanTracking = lessonPlansTrackingNoValidated[i];
        const displayNameStudent = lessonPlanTracking.student.user.displayName;
        const validateLessonPlanEmail = new StudentChangeDateToValidateLessonPlanEmail(
          periodDisplayName,
          displayNameStudent,
          displayNameTeacher,
          subjectName,
          spanishLessonPlanDate,
          spanishMaxValidationLessonPlanDate,
        );
        this.emailService.sendEmail(validateLessonPlanEmail, lessonPlanTracking.student.user.email);
      }
    }
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

  async removeResource(id: string, deleteResourceDto: DeleteResourceDto) {
    const { name } = deleteResourceDto;
    const lessonPlan = await this.findOne(id);
    const resources = lessonPlan.resources as any[];
    const currentResources = resources.filter(
      (resource) => resource.url !== name,
    );
    await this.lessonPlansRepository.removeResource(id, currentResources);
    await fs.unlinkSync(`./uploads/${name}`);
  }

  async generateTeacherLessonPlanReport(
    userId: string,
    lessonPlanReportDto: LessonPlanReportDto,
  ) {
    try {
      const { from, to, periodId, subjectId, gradeId } = lessonPlanReportDto;
      const period = await this.periodService.findActivePeriodById(periodId);
      const teacher = await this.teacherService.findTeacherByUserInActivePeriod(
        period.id,
        userId,
      );
      const lessonPlans =
        await this.lessonPlansRepository.findLessonPlansForTeacherReport(
          new Date(from),
          new Date(to),
          periodId,
          subjectId,
          teacher.id,
          gradeId,
        );

      if (lessonPlans.length === 0) {
        throw new BadRequestException();
      }

      const fileName = await this.reportService.generateMultipleLessonPlanReport(
        lessonPlans,
      );
      return fileName;
    } catch (error) {
      console.warn("ERROR - Generate teacher lesson plan report", error);
    }
  }

  async generateLessonPlanReport(
    lessonPlanId: string,
  ) {
    try {
      const lessonPlan = await this.lessonPlansRepository.findLessonPlanForReport(lessonPlanId);

      if (!lessonPlan) {
        throw new BadRequestException();
      }

      const fileName = await this.reportService.generateLessonPlanReport(
        lessonPlan,
      );
      return fileName;
    } catch (error) {
      console.warn("ERROR - Generate teacher lesson plan report", error);
    }
  }
}

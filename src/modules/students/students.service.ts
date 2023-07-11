import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Exception } from 'handlebars';
import {
  getDuplicatedEmails,
  isEmailDomainValid,
} from '../../utils/email.utils';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { StudentsRepository } from './students.repository';
import { ValidateStudentsNumberDto } from './dto/validate-students-number.dto';
import { GetLessonPlansDto } from './dto/get-lesson-plans.dto';
import { PeriodsService } from '../periods/periods.service';
import { LessonPlansTrackingService } from '../lesson-plan-validation-tracking/lesson-plan-tracking.service';
import { UsersService } from '../users/users.service';
import { LessonPlansService } from '../lesson-plans/lesson-plans.service';

@Injectable()
export class StudentsService {
  readonly baseI18nKey = 'students.service';

  readonly initialProcessBaseI18nKey = 'initial-process.repository';
  
  constructor(
    private studentsRepository: StudentsRepository,
    private periodService: PeriodsService,
    private usersService: UsersService,
    private lessonPlanTrackingService: LessonPlansTrackingService,
    private lessonPlanService: LessonPlansService,
    private i18nService: I18nService,
  ) {}

  async getLessonPlansInActivePeriods(getLessonPlansDto: GetLessonPlansDto) {
    const { isValidated, userId, periodId } = getLessonPlansDto;
    const activePeriod = await this.periodService.findOne(periodId);
    const studentsAssignedToUser = await this.getStudentsByUserInActivePeriod(userId, activePeriod.id);
    const studentIds = studentsAssignedToUser.map(students => students.id);
    
    if (studentsAssignedToUser.length === 0) {
      throw new Exception('User does not have any assigned student in active periods.');
    }

    return this.lessonPlanTrackingService.getLessonPlansByStudentsAndPeriods(isValidated.toUpperCase() === 'TRUE', studentIds, [activePeriod.id]);
  }

  async findStudentsByUser(
    userId: string,
    i18nContext: I18nContext = undefined,
  ) {
    const i18n = i18nContext || this.i18nService;
    const students = await this.studentsRepository.findStudentsByUser(userId);

    if (students.length === 0) {
      throw new NotFoundException(
        i18n.t(`${this.baseI18nKey}.common.NOT_ASSIGNED_TEACHER`),
      );
    }

    return students;
  }

  async getLessonPlanIfStudentIsAllowedToValidate(userId: string, lessonPlanId: string) {
    const lessonPlan = await this.lessonPlanService.findOne(lessonPlanId);
    const activePeriod = await this.periodService.findActivePeriodById(lessonPlan.periodId);
    const studentsAssignedToUser = await this.getStudentsByUserInActivePeriod(userId, activePeriod.id);

    if (studentsAssignedToUser.length === 0) {
      // TODO: Add I18N
      throw new Exception('User has not assigned any student in requested period');
    }

    const lessonPlanTrackingRecord = await this.lessonPlanTrackingService.getLessonPlanTrackingByLessonPlanIdAndPeriod(lessonPlanId, activePeriod.id);

    const studentToValidateLessonPlan = studentsAssignedToUser.find(student => lessonPlanTrackingRecord.studentId === student.id);
    
    if (!studentToValidateLessonPlan) {
      // TODO: Add I18N
      throw new Exception('User is not allowed to validate the requested lesson plan');
    }
    
    return lessonPlan;
  }

  async findStudentActivePeriodsByUser(
    userId: string,
    i18nContext: I18nContext = undefined,
  ) {
    const i18n = i18nContext || this.i18nService;
    const user = await this.usersService.findOne(userId);
    await this.findStudentsByUser(userId, i18nContext);

    const activePeriods = await this.periodService.findActivePeriods();
    const activePeriodsIds = activePeriods.map((activePeriod) => activePeriod.id);
    const activePeriodsByStudent = await this.studentsRepository.findStudentsInPeriodsByUser(activePeriodsIds, user.id);

    if (!activePeriodsByStudent) {
      throw new BadRequestException(
        i18n.t(
          `${this.baseI18nKey}.findTeacherActivePeriodsByUser.NOT_TEACHERS_IN_ACTIVE_PERIODS`,
        ),
      );
    }

    const activePeriodsIdsByTeacher = activePeriodsByStudent.map((activePeriod) => activePeriod.periodId);
    return this.periodService.findManyByPeriodIds(activePeriodsIdsByTeacher);;
  }

  findAll(filterStudentDto?: FilterStudentDto) {
    return this.studentsRepository.findAll(filterStudentDto);
  }

  getStudentsByUserInActivePeriod(userId: string, activePeriodId: string) {
    return this.studentsRepository.getStudentsByUserAndPeriod(userId, activePeriodId);
  }

  validateStudentEmail(createStudentDto: CreateStudentDto, i18nContext: I18nContext) {
    const { email } = createStudentDto;
    const isDomainValid = isEmailDomainValid(email);

    if (!isDomainValid) {
      throw new BadRequestException(i18nContext.t('common.INSTITUTIONAL_EMAIL'));
    }
  }

  validateStudents(createStudentsDto: CreateStudentDto[], i18nContext: I18nContext) {
    const studentsEmails = createStudentsDto.map(({ email }) => email);
    const duplicatedEmails = getDuplicatedEmails(studentsEmails);

    if (duplicatedEmails.length > 0) {
      throw new BadRequestException(
        `${i18nContext.t(`${this.baseI18nKey}.validateStudents.DUPLICATED_EMAILS`)} ${duplicatedEmails.join(', ')}`
      );
    }

    for (const studentDto of createStudentsDto) {
      this.validateStudentEmail(studentDto, i18nContext);
    }
  }

  validateStudentsNumber(validateStudentsNumberDto: ValidateStudentsNumberDto, minimumStudents: number, i18nContext: I18nContext) {
    let { students } = validateStudentsNumberDto;
    let mismatchedGrades = [];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let count = 0;
      const keyToValidate = JSON.stringify({ numberParallel: student.numberParallel, parallel: student.parallel });
      for (let j = 0; j < students.length; j++) {
        const studentToValidate = students[j];
        const keyValue = JSON.stringify({ numberParallel: studentToValidate.numberParallel, parallel: studentToValidate.parallel });
        if (keyToValidate === keyValue) {
          count += 1;
        }
      }
      if (count < minimumStudents) {
        mismatchedGrades.push(`${student.numberParallel} "${student.parallel}" `);
      }
      students = students.filter(obj => JSON.stringify({ numberParallel: obj.numberParallel, parallel: obj.parallel }) !== JSON.stringify({ numberParallel: student.numberParallel, parallel: student.parallel }) );
    }
    
    if (mismatchedGrades.length > 0) {
      throw new BadRequestException(`${i18nContext.t(`${this.initialProcessBaseI18nKey}.create.MINIMUM_STUDENTS`)} ${mismatchedGrades.join(', ')}`);
    }
  }
}

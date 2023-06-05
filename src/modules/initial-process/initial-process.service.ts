import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { GradesService } from '../grades/grades.service';
import { PeriodsService } from '../periods/periods.service';
import { RolesService } from '../roles/roles.service';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { UsersService } from '../users/users.service';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { UpdateInitialProcessDto } from './dto/update-initial-process.dto';
import { InitialProcessRepository } from './initial-process.repository';
import { Role } from '../../utils/enums/roles.enum';
import { SendEmailService } from '../common/services/send-email.service';
import { StudentLessonPlanStartEmail } from '../common/strategies/email/student/lesson-plan-start.strategy';
import { TeacherLessonPlanStartEmail } from '../common/strategies/email/teacher/lesson-plan-start.strategy';
import { ManagerLessonPlanStartEmail } from '../common/strategies/email/manager/lesson-plan-start.strategy';
import { SendFakeEmailService } from '../common/services/send-fake-email.service';

@Injectable()
export class InitialProcessService {
  constructor(
    private initialProcessRepository: InitialProcessRepository,
    private periodsService: PeriodsService,
    private usersService: UsersService,
    private studentsService: StudentsService,
    private teachersService: TeachersService,
    private gradesService: GradesService,
    private rolesService: RolesService,
    private sendEmailService: SendFakeEmailService
  ) {}

  async create(createInitialProcessDto: CreateInitialProcessDto, i18nContext: I18nContext) {
    const {
      period,
      manager: { userId },
      students,
      teachers,
      minimumStudents,
    } = createInitialProcessDto;

    const manager = await this.usersService.findOne(userId);
    const { minimumStudentsToEvaluate } = minimumStudents;
    this.periodsService.validateDates(period, i18nContext);
    this.studentsService.validateStudents(students, i18nContext);
    this.studentsService.validateStudentsNumber({ students }, minimumStudentsToEvaluate, i18nContext);
    this.teachersService.validateTeachers(teachers, i18nContext);
    this.gradesService.validateGradesMatch({ students, teachers }, i18nContext);
    const studentRole = await this.rolesService.findByName(Role.Student);
    const teacherRole = await this.rolesService.findByName(Role.Teacher);

    const roleIds = {
      studentRoleId: studentRole.id,
      teacherRoleId: teacherRole.id,
    };

    const [
      userStudents,
      userTeachers
    ] = await this.initialProcessRepository.create(
      createInitialProcessDto,
      roleIds,
      i18nContext
    );

    const lessonPlanYear = {
      startYear: new Date(period.startDate).getFullYear(),
      endYear: new Date(period.endDate).getFullYear()
    }

    userStudents.forEach(createdStudent => {
      const { displayName, email, registerConfig } = createdStudent;
      const lessonPlanStartEmail = new StudentLessonPlanStartEmail(displayName, lessonPlanYear, registerConfig?.registerToken);
      this.sendEmailService.sendEmail(lessonPlanStartEmail, email);
    });

    userTeachers.forEach(createdTeacher => {
      const { displayName, email, registerConfig } = createdTeacher;
      const lessonPlanStartEmail = new TeacherLessonPlanStartEmail(displayName, lessonPlanYear, registerConfig?.registerToken);
      this.sendEmailService.sendEmail(lessonPlanStartEmail, email);
    });

    const managerLessonPlanStartEmail = new ManagerLessonPlanStartEmail(manager.name, period);
    this.sendEmailService.sendEmail(managerLessonPlanStartEmail, manager.email);

    return createInitialProcessDto;
  }

  findAll() {
    return this.initialProcessRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} initialProcess`;
  }

  update(id: number, updateInitialProcessDto: UpdateInitialProcessDto) {
    return `This action updates a #${id} initialProcess`;
  }

  remove(id: number) {
    return `This action removes a #${id} initialProcess`;
  }
}

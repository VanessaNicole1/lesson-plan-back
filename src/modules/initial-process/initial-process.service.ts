import { Injectable } from '@nestjs/common';
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
import { I18nContext } from 'nestjs-i18n';
import { SendEmailService } from '../common/services/send-email.service';
import { TeacherFisrtTimeLoginEmail } from '../common/strategies/email/first-time-register.strategy';

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
    private sendEmailService: SendEmailService
  ) {}

  async create(createInitialProcessDto: CreateInitialProcessDto, i18nContext: I18nContext) {
    const {
      period,
      manager: { userId },
      students,
      teachers,
    } = createInitialProcessDto;

    await this.usersService.findOne(userId);
    this.periodsService.validateDates(period, i18nContext);
    this.studentsService.validateStudents(students, i18nContext);
    this.teachersService.validateTeachers(teachers, i18nContext);
    this.gradesService.validateGradesMatch({ students, teachers }, i18nContext);

    const studentRole = await this.rolesService.findByName(Role.Student);
    const teacherRole = await this.rolesService.findByName(Role.Teacher);

    const roleIds = {
      studentRoleId: studentRole.id,
      teacherRoleId: teacherRole.id,
    };

    await this.initialProcessRepository.create(
      createInitialProcessDto,
      roleIds,
    );
    
    const firstTime = new TeacherFisrtTimeLoginEmail();

    students.forEach(student => {
      this.sendEmailService.sendEmail(firstTime, student.email)
    });
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

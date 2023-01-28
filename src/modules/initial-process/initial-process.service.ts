import { CreateScheduleDto } from './../schedule/dto/create-schedule.dto';
import { Helpers } from 'src/helpers/helpers';
import { SubjectsService } from './../subjects/subjects.service';
import { TeachersService } from './../teachers/teachers.service';
import { StudentsService } from './../students/students.service';
import { DegreeService } from './../degree/degree.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { PeriodsService } from '../period/period.service';
import { ManagerService } from '../manager/manager.service';
import { UserService } from '../user/users.service';
import { GradeService } from '../grade/grade.service';
import { CreateStudentDto } from '../students/dto/create-student-dto';
import { CreateGradeDto } from '../grade/dto/create-grade-dto';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class InitialProcessService {
  constructor(
    @Inject(PeriodsService)
    private periodService: PeriodsService,
    @Inject(DegreeService)
    private degreeService: DegreeService,
    @Inject(ManagerService)
    private managerService: ManagerService,
    @Inject(GradeService)
    private gradeService: GradeService,
    @Inject(StudentsService)
    private studentService: StudentsService,
    @Inject(TeachersService)
    private teacherService: TeachersService,
    @Inject(SubjectsService)
    private subjectService: SubjectsService,
    @Inject(UserService)
    private userService: UserService,
    @Inject(ScheduleService)
    private scheduleService: ScheduleService,
  ) {}

  async createInitialProcess(createInitialProcessDto: CreateInitialProcessDto) {
    const {
      period: { startDate, endDate },
      degree: { name },
      userId,
      students,
      teachers,
      // subjects,
    } = createInitialProcessDto;

    const studentEmails = students.map((student) => student.email);
    const teacherEmails = teachers.map((teacher) => teacher.email);

    console.log('students', students);
    console.log('teachers', teachers);

    // TODO: Remove
    // const subjectNames = subjects.map((subject) => subject.name);

    const duplicateStudentEmails = Helpers.getDuplicateEmails(studentEmails);
    const duplicateTeacherEmails = Helpers.getDuplicateEmails(teacherEmails);
    const duplicatedSchedules = Helpers.getDuplicatedSchedule(teachers);

    // TODO: Remove
    // const duplicateSubjectNames = Helpers.getDuplicateNames(subjectNames);

    const messageError = {};

    if (duplicateStudentEmails.length > 0) {
      messageError[
        'studentError'
      ] = `Estos correos se repiten en el archivo de estudiantes ${duplicateStudentEmails}`;
    }

    if (duplicateTeacherEmails.length > 0) {
      messageError[
        'teacherError'
      ] = `Estos correos se repiten en el archivo de docentes ${duplicateStudentEmails}`;
    }

    if (duplicatedSchedules.length > 0) {
      messageError[
        'scheduleError'
      ] = `Estas materias y cursos se repiten en diferentes docentes ${duplicatedSchedules}`;
    }

    // TODO: Remove
    // if (duplicateSubjectNames.length > 0) {
    //   messageError[
    //     'subjectError'
    //   ] = `Estos correos se repiten en el archivo de materias ${duplicateSubjectNames}`;
    // }

    if (Object.keys(messageError).length !== 0) {
      throw new BadRequestException(messageError);
    }

    await this.periodService.validateDates({ startDate, endDate });
    await this.userService.getUserById(userId);

    const period = await this.periodService.createPeriod({
      startDate,
      endDate,
    });
    const periodId = period.id;
    const user = await this.userService.getUserById(userId);
    const manager = await this.managerService.onlyCreateAManager(user);

    const degree = await this.degreeService.createDegree({
      name,
      periodId,
      managerId: manager.user.id,
    });

    const degreeId = degree.id;

    const grades = students.map(
      (student) => `${student.numberParallel}${student.parallel}`,
    );

    const uniqGrades = [...new Set(grades)];

    for (let i = 0; i < uniqGrades.length; i++) {
      const grade = uniqGrades[i].toString();
      const gradeSplit = grade.split('');
      const createGradeDto: CreateGradeDto = {
        numberParallel: gradeSplit[0],
        parallel: gradeSplit[1],
      };
      await this.gradeService.createNewGrade(createGradeDto, degreeId);
    }

    for (let i = 0; i < students.length; i++) {
      const { name, lastName, email, numberParallel, parallel } = students[i];

      const grade = await this.gradeService.verifyGradeExist(
        numberParallel,
        parallel,
      );
      const createStudentDto: CreateStudentDto = {
        name,
        lastName,
        email,
      };
      await this.studentService.createStudent(createStudentDto, grade);
    }

    for (let i = 0; i < teachers.length; i++) {
      const { name, lastName, email, numberParallel, parallel, subject } =
        teachers[i];

      const grade = await this.gradeService.verifyGradeExist(
        numberParallel,
        parallel,
      );

      const currentSubject = await this.subjectService.createSubject({
        name: subject,
      });

      const teacher = await this.teacherService.createTeacher({
        name,
        lastName,
        email,
      });

      const createScheduleDto: CreateScheduleDto = {
        startHour: '00:00',
        endHour: '00:00',
        day: '',
        gradeId: grade.id,
        subjectId: currentSubject.id,
      };
      await this.scheduleService.createSchedule(createScheduleDto, teacher.id);
    }

    // TODO: Remove
    // for (let i = 0; i < subjects.length; i++) {
    //   const { name } = subjects[i];
    //   await this.subjectService.createSubject({ name });
    // }
  }
}

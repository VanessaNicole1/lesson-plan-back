import { SubjectsService } from './../subjects/subjects.service';
import { CreateStudentDto } from './../students/dto/create-student-dto';
import { TeachersService } from './../teachers/teachers.service';
import { StudentsService } from './../students/students.service';
import { GradeService } from 'src/modules/grade/grade.service';
import { DegreeService } from './../degree/degree.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePeriodAndDegreeDto } from './dto/create-period-degree.dto';
import { PeriodsService } from '../period/period.service';
import { ManagerService } from '../manager/manager.service';
import { CreateGradeDto } from '../grade/dto/create-grade-dto';

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
    private config: ConfigService,
  ) {}

  async createInitialProcess(
    createPeriodAndDegreeDto: CreatePeriodAndDegreeDto,
    studentResults: any,
    teacherResults: any,
    subjectResults: any,
  ) {
    const { startDate, endDate, name } = createPeriodAndDegreeDto;

    const period = await this.periodService.createPeriod({
      startDate,
      endDate,
    });
    const periodId = period.id;
    const managerId = '';

    const degree = await this.degreeService.createDegree({
      name,
      periodId,
      managerId,
    });

    const degreeId = degree.id;

    const grades = studentResults.map(
      (student) => `${student.numberParallel}${student.parallel}`,
    );

    const uniqGrades = [...new Set(grades)];

    console.log('Grades', grades);
    console.log('Unique', uniqGrades);

    for (let i = 0; i < uniqGrades.length; i++) {
      const grade = uniqGrades[i].toString();
      const gradeSplit = grade.split('');
      console.log(gradeSplit);
      const createGradeDto: CreateGradeDto = {
        numberParallel: gradeSplit[0],
        parallel: gradeSplit[1],
      };
      await this.gradeService.createNewGrade(createGradeDto, degreeId);
    }

    for (let i = 0; i < studentResults.length; i++) {
      const { name, lastName, email, numberParallel, parallel } =
        studentResults[i];

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

    for (let i = 0; i < teacherResults.length; i++) {
      const { name, lastName, email } = teacherResults[i];
      await this.teacherService.createTeacher({ name, lastName, email });
    }

    for (let i = 0; i < subjectResults.length; i++) {
      const { name } = subjectResults[i];
      await this.subjectService.createSubject({ name });
    }
  }
}

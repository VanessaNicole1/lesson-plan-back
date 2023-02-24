import { Injectable } from '@nestjs/common';
import { GradesService } from '../grades/grades.service';
import { PeriodsService } from '../periods/periods.service';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { UsersService } from '../users/users.service';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { UpdateInitialProcessDto } from './dto/update-initial-process.dto';
import { InitialProcessRepository } from './initial-process.repository';

@Injectable()
export class InitialProcessService {
  constructor(
    private initialProcessRepository: InitialProcessRepository,
    private periodsService: PeriodsService,
    private usersService: UsersService,
    private studentsService: StudentsService,
    private teachersService: TeachersService,
    private gradesService: GradesService,
  ) {}

  create(createInitialProcessDto: CreateInitialProcessDto) {
    const {
      period,
      manager: { userId },
      students,
      teachers,
    } = createInitialProcessDto;

    this.periodsService.validateDates(period);
    this.usersService.findOne(userId);
    this.studentsService.validateStudents(students);
    this.teachersService.validateTeachers(teachers);
    this.gradesService.validateGradesMatch({ students, teachers });

    return this.initialProcessRepository.create(createInitialProcessDto);
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

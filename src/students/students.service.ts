import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGradeDto } from 'src/grade/dto/create-grade-dto';
import { GradeService } from 'src/grade/grade.service';
import { UserService } from 'src/user/users.service';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student-dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @Inject(GradeService)
    private gradeService: GradeService,
    @Inject(UserService)
    private userService: UserService,
    private config: ConfigService,
  ) {}

  async getStudentById(id: string): Promise<Student> {
    if (!id) {
      throw new NotFoundException(`El estudiante no existe`);
    }
    const student = await this.studentsRepository.findOne({
      where: {
        id,
      },
    });

    if (!student) {
      throw new NotFoundException(`El estudiante con ${id} no existe`);
    }
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    return await this.studentsRepository.find();
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    const type = this.config.get('STUDENT_TYPE');
    const { numberParallel, parallel } = createStudentDto;

    let gradeExist = await this.gradeService.verifyGradeExist(
      numberParallel,
      parallel,
    );
    if (!gradeExist) {
      const newGrade: CreateGradeDto = {
        numberParallel,
        parallel,
      };
      gradeExist = await this.gradeService.createGrade(newGrade);
    }
    const user = await this.userService.createUser(createStudentDto, type);
    const student = this.studentsRepository.create({});
    student.grade = gradeExist;
    student.user = user;
    await this.studentsRepository.save(student);
    return { message: 'Student created successfully' };
  }

  async updateStudent(updateStudentDto: UpdateStudentDto) {
    return updateStudentDto;
  }

  async deleteStudent(id: string): Promise<void> {
    if (!id) {
      throw new NotFoundException(`El estudiante no existe`);
    }
    const result = await this.studentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El estudiante con ${id} no existe`);
    }
  }
}

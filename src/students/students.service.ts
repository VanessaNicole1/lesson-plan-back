import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGradeDto } from 'src/grade/dto/create-grade-dto';
import { GradeService } from 'src/grade/grade.service';
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
  ) {}

  async getStudentById(id: string): Promise<Student> {
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
    const { address, name, lastName, email, password, number, parallel } = createStudentDto;
    const createGradeData: CreateGradeDto = {
      number,
      parallel,
    };
    let gradeExist = await this.gradeService.verifyGradeExist(number, parallel);
    if (!gradeExist) {
      gradeExist = await this.gradeService.createGrade(createGradeData);
    }
    const student = this.studentsRepository.create({
      address,
      name,
      lastName,
      email,
      password,
    });
    student.grade = gradeExist;
    await this.studentsRepository.save(student);
  }

  async updateStudent(updateStudentDto: UpdateStudentDto) {
    return updateStudentDto;
  }

  async deleteStudent(id: string): Promise<void> {
    const result = await this.studentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El estudiante con ${id} no existe`);
    }
  }
}

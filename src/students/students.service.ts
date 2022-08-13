import { Injectable, NotFoundException } from '@nestjs/common';
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

  // async getStudents(gradeId) {
  //   return this.studentsRepository.find({
  //     where: {
  //       grade: gradeId,
  //     },
  //   });
  // }

  async createStudent(
    createStudentDto: CreateStudentDto,
    createGradeDto: CreateGradeDto,
    gradeService: GradeService,
  ) {
    const { address, name, lastName, email, password } = createStudentDto;
    const { number, parallel } = createGradeDto;
    let gradeExist = gradeService.getGradeByNameAndParallel(number, parallel);
    if (!gradeExist) {
      gradeService.createGrade(createGradeDto);
      gradeExist = gradeService.getGradeByNameAndParallel(number, parallel);
    }
    const student = this.studentsRepository.create({
      address,
      name,
      lastName,
      email,
      password,
    });
    //student.grade.id = gradeExist;
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

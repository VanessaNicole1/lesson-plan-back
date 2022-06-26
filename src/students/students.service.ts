import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getStudents() {
    return 1;
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    const { address, name, lastName, email } = createStudentDto;
    const student = this.studentsRepository.create({
      address,
      name,
      lastName,
      email,
    });
    await this.studentsRepository.save(student);
  }

  async updateStudent(updateStudentDto: UpdateStudentDto) {
    return updateStudentDto;
  }

  async deleteStudent(id: string): Promise<void> {
    const student = this.getStudentById(id);
  }
}

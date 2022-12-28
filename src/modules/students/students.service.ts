import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GradeService } from 'src/modules/grade/grade.service';
import { UserService } from 'src/modules/user/users.service';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student-dto';
import { CreateStudentWithExistingGradeDto } from './dto/create-student-with-grade-dto';
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
      relations: ['grade', 'user'],
    });

    if (!student) {
      throw new NotFoundException(`El estudiante con ${id} no existe`);
    }
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    return await this.studentsRepository.find({
      relations: ['grade', 'user'],
    });
  }

  async createStudent(createStudentDto: CreateStudentDto, grade: any) {
    const type = this.config.get('STUDENT_TYPE');

    if (!grade) {
      throw new NotFoundException(
        `El estudiante tiene que tener un grado asignado`,
      );
    }

    const user = await this.userService.createUser(createStudentDto, type);
    const student = this.studentsRepository.create({});
    student.grade = grade;
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

  async createStudentWithGrade(
    createStudentGradeDto: CreateStudentWithExistingGradeDto,
  ) {
    const type = this.config.get('STUDENT_TYPE');
    const { gradeId } = createStudentGradeDto;

    if (!gradeId) {
      throw new NotFoundException(
        `El estudiante tiene que tener un grado asignado`,
      );
    }

    const existingGrade = await this.gradeService.getGradeById(gradeId);

    const user = await this.userService.createUser(createStudentGradeDto, type);
    const student = this.studentsRepository.create({});
    student.grade = existingGrade;
    student.user = user;
    await this.studentsRepository.save(student);
    return { message: 'Student created successfully' };
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Helpers } from 'src/helpers/helpers';
import { GradeService } from 'src/modules/grade/grade.service';
import { UserService } from 'src/modules/user/users.service';
import { Repository } from 'typeorm';
import { User } from '../user/user-entity';
import { CreateStudentDto } from './dto/create-student-dto';
import { CreateStudentWithExistingGradeDto } from './dto/create-student-with-grade-dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { ValidateStudentFormatDto } from './dto/validate-student-format-dto';
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

    const { email } = createStudentDto;
    const existsUser = await this.userService.getUserByEmail(email);

    if (existsUser) {
      const currentUser = await this.userService.getUserByEmail(email);
      await this.createAStudentAssociation(currentUser, grade);
      return;
    }

    const user = await this.userService.createUser(createStudentDto, type);
    const student = this.studentsRepository.create({});
    student.grade = grade;
    student.user = user;
    await this.studentsRepository.save(student);
  }

  async createAStudentAssociation(user: User, grade: any) {
    const student = this.studentsRepository.create({});
    student.user = user;
    student.grade = grade;
    await this.studentsRepository.save(student);
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

  async validateStudentFormat(
    validateStudentFormatDto: ValidateStudentFormatDto,
  ) {
    const { students } = validateStudentFormatDto;

    let errorMessage = '';

    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      if (!('name' in student)) {
        errorMessage += `El estudiante en el registro ${i} no contiene el nombre\n`;
      }

      if (!('lastName' in student)) {
        errorMessage += `El estudiante en el registro ${i} no contiene el apellido\n`;
      }

      if (!('email' in student)) {
        errorMessage += `El estudiante en el registro ${i} no contiene el correo\n`;
      }

      if (!('numberParallel' in student)) {
        errorMessage += `El estudiante en el registro ${i} no contiene el número del paralelo\n`;
      }

      if (!('parallel' in student)) {
        errorMessage += `El estudiante en el registro ${i} no contiene el paralelo\n`;
      }

      const { name, lastName, email, numberParallel, parallel } = student;

      if (!name) {
        errorMessage += `El estudiante en el registro ${i} tiene el campo nombre vacio\n`;
      }

      if (!lastName) {
        errorMessage += `El estudiante en el registro ${i} tiene el campo apellido vacio\n`;
      }

      if (!email) {
        errorMessage += `El estudiante en el registro ${i} tiene el campo email vacio\n`;
      }

      if (!numberParallel) {
        errorMessage += `El estudiante en el registro ${i} tiene el campo numero de paralelo vacio\n`;
      }

      if (!parallel) {
        errorMessage += `El estudiante en el registro ${i} tiene el campo paralelo vacio\n`;
      }
    }
    const studentEmails = students.map((student) => student.email);
    const duplicateStudentEmails = Helpers.getDuplicateEmails(studentEmails);
    if (duplicateStudentEmails.length > 0) {
      errorMessage += `Estos correos se repiten en el archivo de estudiantes ${duplicateStudentEmails}`;
    }
    console.log('errorMessage', errorMessage);
    return errorMessage;
  }
}

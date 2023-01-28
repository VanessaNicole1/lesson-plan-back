import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { UpdateTeacherDto } from './dto/update-teacher-dto';
import { UserService } from 'src/modules/user/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user-entity';
import { Helpers } from 'src/helpers/helpers';
import { ValidateTeacherFormatDto } from './dto/validate-teacher-format-dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @Inject(UserService)
    private userService: UserService,
    private config: ConfigService,
  ) {}

  async getTeacherById(id: string): Promise<Teacher> {
    if (!id) {
      throw new NotFoundException(`El docente no existe`);
    }
    const teacher = await this.teachersRepository.findOne({
      where: {
        id,
      },
      relations: ['schedule', 'user'],
    });

    if (!teacher) {
      throw new NotFoundException(`El docente con ${id} no existe`);
    }
    return teacher;
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const type = this.config.get('TEACHER_TYPE');
    const { email } = createTeacherDto;
    const currentUser = await this.userService.getUserByEmail(email);

    if (currentUser) {
      const currentUser = await this.userService.getUserByEmail(email);
      await this.createATeacherAssociation(currentUser);
      return;
    }
    const user = await this.userService.createUser(createTeacherDto, type);
    const teacher = this.teachersRepository.create({});
    teacher.user = user;
    return await this.teachersRepository.save(teacher);
  }

  async createATeacherAssociation(user: User) {
    const teacher = this.teachersRepository.create({});
    teacher.user = user;
    await this.teachersRepository.save(teacher);
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto) {
    if (!id) {
      throw new NotFoundException(`El docente no existe`);
    }
    const teacherExist = await this.teachersRepository.findOne({
      where: {
        id,
      },
    });
    if (!teacherExist) throw new NotFoundException('Docente no existe');

    const user = await this.userService.getUserById(teacherExist.user.id);
    await this.userService.updateUser(user.id, updateTeacherDto);
    return await this.teachersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Teacher[]> {
    return await this.teachersRepository.find({
      relations: ['schedule', 'user'],
    });
  }

  async deleteTeacher(id: string): Promise<void> {
    if (!id) {
      throw new NotFoundException(`El docente no existe`);
    }
    const result = await this.teachersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El docente con ${id} no existe`);
    }
  }

  async getTeacherByUserId(id: string) {
    const teacherExist = await this.teachersRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });
    if (!teacherExist) throw new NotFoundException('Docente no existe');
    return teacherExist;
  }

  async validateTeacherFormat(
    validateTeacherFormatDto: ValidateTeacherFormatDto,
  ) {
    const { teachers } = validateTeacherFormatDto;

    let errorMessage = '';

    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];

      if (!('name' in teacher)) {
        errorMessage += `El docente en el registro ${i} no contiene el nombre\n`;
      }

      if (!('lastName' in teacher)) {
        errorMessage += `El docente en el registro ${i} no contiene el apellido\n`;
      }

      if (!('email' in teacher)) {
        errorMessage += `El docente en el registro ${i} no contiene el correo\n`;
      }

      const { name, lastName, email } = teacher;

      if (!name) {
        errorMessage += `El docente en el registro ${i} tiene el campo nombre vacio\n`;
      }

      if (!lastName) {
        errorMessage += `El docente en el registro ${i} tiene el campo apellido vacio\n`;
      }

      if (!email) {
        errorMessage += `El docente en el registro ${i} tiene el campo email vacio\n`;
      }
    }
    const teacherEmails = teachers.map((teacher) => teacher.email);
    const duplicateTeacherEmails = Helpers.getDuplicateEmails(teacherEmails);
    if (duplicateTeacherEmails.length > 0) {
      errorMessage += `Estos correos se repiten en el archivo de docentes ${duplicateTeacherEmails}`;
    }
    console.log('errorMessage', errorMessage);
    return errorMessage;
  }
}

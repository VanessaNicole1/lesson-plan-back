import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { UpdateTeacherDto } from './dto/update-teacher-dto';
import { UserService } from 'src/user/users.service';
import { ConfigService } from '@nestjs/config';

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
    const teacher = await this.teachersRepository.findOne({
      where: {
        id,
      },
    });

    if (!teacher) {
      throw new NotFoundException(`El profesor con ${id} no existe`);
    }
    return teacher;
  }

  async getSubjectsByTeacher(id) {
    const data = await this.teachersRepository.find({
      relations: ['subjects'],
    });

    for (let i = 0; i < data.length; i++) {
      const teacher_id = data[i].id;
      if (id === teacher_id) {
        const teacher_subjects = data[i];
        if (teacher_subjects.subjects.length < 0) {
          throw new NotFoundException(
            `El profesor con ${id} no tiene materias registradas`,
          );
        }
        return teacher_subjects;
      }
    }
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const type = this.config.get('TEACHER_TYPE');
    const user = await this.userService.createUser(createTeacherDto, type);
    const teacher = this.teachersRepository.create({});
    teacher.user = user;
    await this.teachersRepository.save(teacher);
    return { message: 'Teacher created successfully' };
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto) {
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
    return await this.teachersRepository.find();
  }

  async deleteTeacher(id: string): Promise<void> {
    const result = await this.teachersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El profesor con ${id} no existe`);
    }
  }
}

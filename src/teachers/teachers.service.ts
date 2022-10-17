import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { UpdateTeacherDto } from './dto/update-teacher-dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    private readonly mailerService: MailerService,
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
    const { identifier, name, lastName, email } = createTeacherDto;
    const teacher = this.teachersRepository.create({
      identifier,
      name,
      lastName,
      email,
    });
    await this.teachersRepository.save(teacher);
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacherExist = await this.teachersRepository.findOne({
      where: {
        id,
      },
    });
    if (!teacherExist) throw new NotFoundException('Docente no existe');
    if (updateTeacherDto.identifier === '') {
      updateTeacherDto.identifier = teacherExist.identifier;
    }
    if (updateTeacherDto.name === '') {
      updateTeacherDto.name = teacherExist.name;
    }
    if (updateTeacherDto.lastName === '') {
      updateTeacherDto.lastName = teacherExist.lastName;
    }
    if (updateTeacherDto.email === '') {
      updateTeacherDto.email = teacherExist.email;
    }
    const { subjects } = updateTeacherDto;
    const data = await this.teachersRepository.preload({
      id,
      ...updateTeacherDto,
      subjects,
    });
    return this.teachersRepository.save(data);
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

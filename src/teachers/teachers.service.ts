import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { UpdateTeacherDto } from './dto/update-teacher-dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
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

  async getSubjectsByTeacher(id: string) {
    const data = await this.teachersRepository.find({
      relations: ['subjects'],
      where: {
        id: id,
      },
    });
    return data;
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
    let { subjects } = updateTeacherDto;
    const teacher = await this.getSubjectsByTeacher(teacherExist.id);
    const teachersSubjects = teacher[0].subjects;
    console.log('Teacher SUbjects:', teachersSubjects, typeof teachersSubjects);
    console.log('Subjecs:', subjects, typeof subjects);
    if (teachersSubjects.length > 0) {
      subjects = subjects.concat(teachersSubjects);
      console.log('NEW SUBJECT:', subjects, typeof subjects);
    }
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

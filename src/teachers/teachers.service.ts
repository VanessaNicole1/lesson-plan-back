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
      updateTeacherDto.name = teacherExist.identifier;
    }
    if (updateTeacherDto.lastName === '') {
      updateTeacherDto.lastName = teacherExist.lastName;
    }
    if (updateTeacherDto.email === '') {
      updateTeacherDto.email = teacherExist.email;
    }
    await this.teachersRepository.update(id, updateTeacherDto);
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

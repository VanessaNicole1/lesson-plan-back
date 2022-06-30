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

  // async getTeachers(gradeId) {
  //   return this.teachersRepository.find({
  //     where: {
  //       grade: gradeId,
  //     },
  //   });
  // }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const { address, name, lastName, email } = createTeacherDto;
    const teacher = this.teachersRepository.create({
      address,
      name,
      lastName,
      email,
    });
    await this.teachersRepository.save(teacher);
  }

  async updateStudent(updateTeacherDto: UpdateTeacherDto) {
    return updateTeacherDto;
  }

  async deleteTeacher(id: string): Promise<void> {
    const result = await this.teachersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El profesor con ${id} no existe`);
    }
  }
}

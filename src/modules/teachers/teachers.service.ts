import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmailDomainValid } from 'src/utils/email.utils';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersRepository } from './teachers.repository';

@Injectable()
export class TeachersService {

  constructor(private teachersRepository: TeachersRepository) {}

  create(createTeacherDto: CreateTeacherDto) {
    return 'This action adds a new teacher';
  }

  findAll() {
    return this.teachersRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }

  validateTeacherEmail(createTeacherDto: CreateTeacherDto ) {
    const { email } = createTeacherDto;
    const isDomainValid = isEmailDomainValid(email); 

    if (!isDomainValid) {
      throw new BadRequestException('El email del docente debe ser el institucional.')
    }
  }

  validateTeachers(teachers: CreateTeacherDto[]) {
    for (const teacher of teachers) {
      this.validateTeacherEmail(teacher);
    }

    const duplicatedTeachersBySubjectAndGrade = this.getDuplicatedTeachersBySubjectAndGrade(teachers);

    if (duplicatedTeachersBySubjectAndGrade.length > 0) {

      let message = `Los siguientes docentes tienen asignadas la misma materia en el mismo ciclo: \n`;

      for (const duplicatedTeachers of duplicatedTeachersBySubjectAndGrade) {
        const { first, second, subject, grade } = duplicatedTeachers;
        const duplicatedTeachersMessage = `- Docentes: ${first} y ${second} - Materia: ${subject} - Ciclo: ${grade}\n`;
        message+= duplicatedTeachersMessage;
      }

      throw new BadRequestException(message);
    }
  }

  private getDuplicatedTeachersBySubjectAndGrade(teachers: CreateTeacherDto[]) {
    const uniqueTeachers = [];
    const duplicatedInfo = [];
    const getMetadataFromTeacher = ({ subject, numberParallel, parallel }: CreateTeacherDto) => `${numberParallel} - ${parallel} - ${subject}`;

    for (const teacher of teachers) {
      const teacherMetadata = getMetadataFromTeacher(teacher);

      const duplicatedTeacher: CreateTeacherDto = uniqueTeachers.find(uniqueTeacher => {
        const uniqueTeacherMetadata = getMetadataFromTeacher(uniqueTeacher);
        return teacherMetadata === uniqueTeacherMetadata;
      });

      if (duplicatedTeacher) {
        const teachersInformation = {
          first: teacher.email,
          second: duplicatedTeacher.email,
          subject: teacher.subject,
          grade: `${teacher.numberParallel} "${teacher.parallel}"`
        };

        duplicatedInfo.push(teachersInformation);
      } else {
        uniqueTeachers.push(teacher);
      }
    }

    return duplicatedInfo;
  }

}

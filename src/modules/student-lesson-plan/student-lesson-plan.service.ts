import { LessonPlanService } from './../lesson-plan/lesson-plan.service';
import { StudentsService } from './../students/students.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignStudentToLessonDto } from './dto/assign-student-lesson.dto';
import { StudentLessonPlan } from './student-lesso-plan-entity';

@Injectable()
export class StudentLessonPlanService {
  constructor(
    @InjectRepository(StudentLessonPlan)
    private studentLessonPlanRepository: Repository<StudentLessonPlan>,
    @Inject(StudentsService)
    private studentService: StudentsService,
    @Inject(forwardRef(() => LessonPlanService))
    private lessonPlanService: LessonPlanService,
  ) {}

  async assignStudentToLessonPlan(
    assignStudentLesson: AssignStudentToLessonDto,
  ) {
    const { idStudent, idLessonPlan } = assignStudentLesson;

    if (!idStudent || !idLessonPlan) {
      return {
        message:
          'Los identificadores del estudiante y del plan de clases son requeridos',
      };
    }

    const student = await this.studentService.getStudentById(idStudent);
    const lessonPlan = await this.lessonPlanService.getLessonPlanById(
      idLessonPlan,
    );

    const studentLessonPlan = await this.studentLessonPlanRepository.create({
      createdAt: new Date(),
      isValidated: false,
    });
    studentLessonPlan.student = student;
    studentLessonPlan.lessonPlan = lessonPlan;
    await this.studentLessonPlanRepository.save(studentLessonPlan);
    return { message: 'Se ha asignado con éxito el estudiante' };
  }

  async assignStudentsToLessonPlan(
    assignStudentLesson: AssignStudentToLessonDto,
  ) {
    const { idStudent, idLessonPlan } = assignStudentLesson;

    if (!idStudent || !idLessonPlan) {
      return {
        message:
          'Los identificadores del estudiante y del plan de clases son requeridos',
      };
    }

    const student = await this.studentService.getStudentById(idStudent);
    const lessonPlan = await this.lessonPlanService.getLessonPlanById(
      idLessonPlan,
    );

    const studentLessonPlan = await this.studentLessonPlanRepository.create({
      createdAt: new Date(),
      isValidated: false,
    });
    studentLessonPlan.student = student;
    studentLessonPlan.lessonPlan = lessonPlan;
    await this.studentLessonPlanRepository.save(studentLessonPlan);
  }

  async removeStudentFromLessonPlan(idStudentLessonPlan: string) {
    if (!idStudentLessonPlan) {
      return {
        message: 'El identificador es requerido',
      };
    }
    const result = await this.studentLessonPlanRepository.delete(
      idStudentLessonPlan,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`La asignación no existe`);
    }
    return { message: 'La asignación ha sido eliminada' };
  }
}

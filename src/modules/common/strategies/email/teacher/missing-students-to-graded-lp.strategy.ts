import { EmailStrategy } from '../../../interfaces/email/email-strategy.interface';
import { getEmailTemplate } from '../../../../../utils/template.utils';

export class TeacherMissingStudentsToValidateLessonPlanEmail implements EmailStrategy {
  
  constructor (
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
    private readonly subjectName: string,
    private readonly students: any[],
    private readonly deadline: string,
    private readonly lessonPlanId: string,
  ) {}
  
  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      subjectName: this.subjectName,
      students: this.students,
      deadline: this.deadline,
      url:  `${process.env.FRONTEND}/dashboard/lesson-plan/${this.lessonPlanId}/edit`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/missing-students-to-validate-lp.html', data);
  }
  getSubject(): string {
    return `Docente - Estudiantes pendientes de calificar Plan de Clase`;
  }

}

import { EmailStrategy } from '../../../interfaces/email/email-strategy.interface';
import { getEmailTemplate } from '../../../../../utils/template.utils';

export class TeacherMissingStudentsToGradedLessonPlanEmail implements EmailStrategy {
  
  constructor (
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
    private readonly subjectName: string,
    private readonly students: any[],
    private readonly lessonPlanDate: string,
    private readonly maxQualifyDate: string,
  ) {}
  
  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      subjectName: this.subjectName,
      students: this.students,
      lessonPlanDate: this.lessonPlanDate,
      maxQualifyDate: this.maxQualifyDate
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/missing-students-to-graded-lp.html', data);
  }
  getSubject(): string {
    return `Docente - Estudiantes pendientes de calificar Plan de Clase`;
  }

}
import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class StudentChangeDateToValidateLessonPlanEmail implements EmailStrategy {

  constructor(
    private readonly periodDisplayName: string,
    private readonly studentName: string,
    private readonly teacherName: string,
    private readonly subjectName: string,
    private readonly lessonPlanDate: string,
    private readonly maxValidationLessonPlanDate: string
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      studentName: this.studentName,
      teacherName: this.teacherName,
      subjectName: this.subjectName,
      lessonPlanDate: this.lessonPlanDate,
      maxValidationLessonPlanDate: this.maxValidationLessonPlanDate,
      url: ''
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/student/change-date-to-validate-lesson-plan.html', data);
  }
  getSubject(): string {
    return `Estudiante - Fecha Actualizada - Validar Plan de Clases de la materia ${this.subjectName}`;
  }
}

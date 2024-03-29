import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class StudentEndDateToValidateLessonPlanEmail implements EmailStrategy {

  constructor(
    private readonly periodDisplayName: string,
    private readonly studentName: string,
    private readonly subjectName: string,
    private readonly teacherName: string,
    private readonly lessonPlanDate: string,
    private readonly lessonPlanId: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      studentName: this.studentName,
      subjectName: this.subjectName,
      teacherName: this.teacherName,
      lessonPlanDate: this.lessonPlanDate,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan/student/validate/${this.lessonPlanId}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/student/end-date-to-validate-lesson-plan.html', data);
  }
  getSubject(): string {
    return `Estudiante - Último día para aceptar Plan de Clases de la materia ${this.subjectName}`;
  }
}

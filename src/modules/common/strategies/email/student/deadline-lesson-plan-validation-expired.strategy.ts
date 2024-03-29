import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class StudentDeadlineValidationExpiredEmail implements EmailStrategy {

  constructor(
    private readonly periodDisplayName: string,
    private readonly studentName: string,
    private readonly subjectName: string,
    private readonly teacherName: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      studentName: this.studentName,
      subjectName: this.subjectName,
      teacherName: this.teacherName,
      url: `${process.env.FRONTEND}/dashboard`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/student/deadline-lesson-plan-validation-expired.html', data);
  }
  getSubject(): string {
    return `Estudiante - El tiempo para aceptar el plan de clase de la materia ${this.subjectName} ha expirado.`;
  }
}

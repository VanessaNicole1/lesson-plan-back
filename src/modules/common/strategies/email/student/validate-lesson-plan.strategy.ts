import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class StudentValidateLessonPlanEmail implements EmailStrategy {

  constructor(
    private readonly periodDisplayName: string,
    private readonly studentName: string,
    private readonly subjectName: string,
    private readonly teacherName: string,
    private readonly lessonPlanDate: string,
    private readonly maxValidationLessonPlanDate: string,
    private readonly lessonPlanId: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      studentName: this.studentName,
      subjectName: this.subjectName,
      teacherName: this.teacherName,
      lessonPlanDate: this.lessonPlanDate,
      maxValidationLessonPlanDate: this.maxValidationLessonPlanDate,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan/student/validate/${this.lessonPlanId}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/student/validate-lesson-plan.html', data);
  }
  getSubject(): string {
    return `Estudiante - Validar Plan de Clases de la materia ${this.subjectName}`;
  }
}

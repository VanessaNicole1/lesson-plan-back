import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class TeacherNotLessonPlanForAWeekEmail implements EmailStrategy {

  constructor (
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
    private readonly startDate: string,
    private readonly endDate: string
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      startDate: this.startDate,
      endDate: this.endDate,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan/create`
    }
    
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/not-lesson-plan-for-a-week.html', data);
  }
  getSubject(): string {
    return 'Docente  - Elaboración de planificación Faltante';
  }
}

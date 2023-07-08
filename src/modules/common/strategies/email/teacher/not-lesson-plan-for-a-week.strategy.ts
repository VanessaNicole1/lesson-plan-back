import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class TeacherNotLessonPlanForAWeekEmail implements EmailStrategy {

  constructor (
    private readonly periodDisplayName: string,
    private readonly teacherName: string
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      url: ''
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
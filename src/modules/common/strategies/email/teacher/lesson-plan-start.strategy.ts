import { EmailStrategy } from '../../../interfaces/email/email-strategy.interface';
import { getEmailTemplate } from '../../../../../utils/template.utils';

export class TeacherLessonPlanStartEmail implements EmailStrategy {
  constructor(
    private readonly teacherName: string,
    private readonly lessonPlanYears: { startYear: number, endYear: number },
    private readonly registerToken: string | undefined = undefined,
  ) {}

  getData() {
    const { startYear, endYear } = this.lessonPlanYears;
    const data: any = {
      name: this.teacherName,
      startYear,
      endYear
    };

    if (this.registerToken) {
      data.url = `${process.env.FRONTEND}/auth/register/${this.registerToken}`;
    } else {
      data.url = `${process.env.FRONTEND}/auth/login`
    }

    return data;
  }

  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/lesson-plan-start.html', data);
  }

  getSubject(): string {
    return 'Docente - Inicio Plan de Clases';
  }
}

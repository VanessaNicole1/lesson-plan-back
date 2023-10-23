import { EmailStrategy } from '../../../interfaces/email/email-strategy.interface';
import { getEmailTemplate } from '../../../../../utils/template.utils';

export class StudentLessonPlanStartEmail implements EmailStrategy {
  constructor(
    private readonly studentName: string,
    private readonly lessonPlanYears: { startYear: number, endYear: number }, 
    // private readonly registerToken: string | undefined = undefined,
  ) {}

  getData() {
    const { startYear, endYear } = this.lessonPlanYears;
    const data: any = {
      name: this.studentName,
      startYear,
      endYear
    };

    data.url = `${process.env.FRONTEND}/auth/login`

    // if (this.registerToken) {
    //   data.url = `${process.env.FRONTEND}/auth/register/${this.registerToken}`;
    // } else {
    //   data.url = `${process.env.FRONTEND}/auth/login`
    // }

    return data;
  }

  getTemplate(data: any) {
    return getEmailTemplate('templates/student/lesson-plan-start.html', data);
  }

  getSubject(): string {
    return 'Estudiante - Inicio Plan de Clases';
  }
}

import { EmailStrategy } from '../../../interfaces/email/email-strategy.interface';
import { getEmailTemplate } from '../../../../../utils/template.utils';

export class ManagerLessonPlanStartEmail implements EmailStrategy {
  constructor(
    private readonly managerName: string,
    private readonly lessonPlanDates: { startDate: Date, endDate: Date},
  ) {}

  getData() {
    const dateOptions: any = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    const { startDate, endDate } = this.lessonPlanDates;
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    const data: any = {
      name: this.managerName,
      url: `${process.env.FRONTEND}/auth/login`,
      startYear,
      endYear,
      startDate: new Date(startDate).toLocaleString('es', dateOptions),
      endDate: new Date(endDate).toLocaleString('es', dateOptions)
    };

    return data;
  }

  getTemplate(data: any) {
    return getEmailTemplate('templates/manager/lesson-plan-start.html', data);
  }

  getSubject(): string {
    return 'Director de Carrera - Inicio Plan de Clases';
  }
}

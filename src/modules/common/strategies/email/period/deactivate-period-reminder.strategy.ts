import { EmailStrategy } from '../../../interfaces/email/email-strategy.interface';
import { getEmailTemplate } from '../../../../../utils/template.utils';

export class DeactivatePeriodReminderEmail implements EmailStrategy {
  
  constructor (
    private readonly periodDisplayName: string,
    private readonly managerName: string,
    private readonly endDate: string,
  ) {}
  
  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      managerName: this.managerName,
      endDate: this.endDate,
      url:  `${process.env.FRONTEND}/dashboard/lesson-plan/about`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/period/deactivate-period-reminder.html', data);
  }
  getSubject(): string {
    return 'Periodo - Finalización del periodo académico.';
  }

}

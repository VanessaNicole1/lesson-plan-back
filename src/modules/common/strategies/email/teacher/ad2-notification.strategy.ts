import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class TecaherAd2Notification implements EmailStrategy {

  constructor (
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan/create`
    }
    
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/ad2-notification.html', data);
  }
  getSubject(): string {
    return 'Docente  - Recordatario para creación de plan de clases';
  }
}

import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class TeacherAD2NotFilledEmail implements EmailStrategy {
  constructor(
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      url: `${process.env.FRONTEND}/dashboard/schedule/view`
    };

    return data;
  }

  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/ad2-not-filled.html', data);
  }

  getSubject(): string {
    return 'Docente - Notificaciones AD2';
  }
}

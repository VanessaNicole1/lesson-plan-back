import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class TeacherScheduleNotFilledEmail implements EmailStrategy {
  constructor(
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
    private readonly notFilledSchedules: any
  ) {}

  getData() {
    const data: any = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      schedules: this.notFilledSchedules,
      url: `${process.env.FRONTEND}/dashboard/schedule/view`
    };

    return data;
  }

  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/schedule-not-filled.html', data);
  }

  getSubject(): string {
    return 'Docente - Carga Horaria Atrasada';
  }
}

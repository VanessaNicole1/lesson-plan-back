import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class FinalRemedialLessonPlanReportEmail implements EmailStrategy {

  constructor(
    private readonly remedialPlanId: string,
    private readonly periodDisplayName: string,
    private readonly managerName: string,
    private readonly remedialLessonPlanTopic: string,
    private readonly teacherName: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      managerName: this.managerName,
      remedialLessonPlanTopic: this.remedialLessonPlanTopic,
      teacherName: this.teacherName,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan-remedial/teacher/view/${this.remedialPlanId}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/manager/remedial-final-report.html', data);
  }
  getSubject(): string {
    return `Plan de Clase Remedial - Plan de Clase Remedial Validado y Aceptado`;
  }
}

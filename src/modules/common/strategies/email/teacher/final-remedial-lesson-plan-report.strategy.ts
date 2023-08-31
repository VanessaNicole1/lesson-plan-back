import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class FinalRemedialLessonPlanReportEmail implements EmailStrategy {

  constructor(
    private readonly remedialPlanId: string,
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
    private readonly remedialLessonPlanTopic: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      teacherName: this.teacherName,
      remedialLessonPlanTopic: this.remedialLessonPlanTopic,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan-remedial/teacher/view/${this.remedialPlanId}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/remedial-final-report.html', data);
  }
  getSubject(): string {
    return `Plan de Clase Remedial - Plan de Clase Remedial Validado y Aceptado`;
  }
}

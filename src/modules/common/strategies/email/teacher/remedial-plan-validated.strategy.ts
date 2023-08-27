import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class RemedialPlanValidatedByManagerEmail implements EmailStrategy {

  constructor(
    private readonly remedialPlanId: string,
    private readonly periodDisplayName: string,
    private readonly teacherName: string,
    private readonly subjectName: string,
    private readonly managerName: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      managerName: this.managerName,
      teacherName: this.teacherName,
      subjectName: this.subjectName,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan-remedial/teacher/view/${this.remedialPlanId}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/teacher/remedial-plan-validated.html', data);
  }
  getSubject(): string {
    return `Plan de Clase Remedial - Plan de Clase Remedial Validado`;
  }
}

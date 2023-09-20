import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class AcceptRemedialPlanEmail implements EmailStrategy {

  constructor(
    private readonly remedialPlanId: string,
    private readonly periodDisplayName: string,
    private readonly studentName: string,
    private readonly teacherName: string,
    private readonly subjectName: string,
    private readonly classStartDate: string,
    private readonly managerName: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      studentName: this.studentName,
      teacherName: this.teacherName,
      subjectName: this.subjectName,
      managerName: this.managerName,
      startDate: this.classStartDate,
      url: `${process.env.FRONTEND}/dashboard/lesson-plan-remedial/student/validate/${this.remedialPlanId}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/student/accept-remedial-plan.html', data);
  }
  getSubject(): string {
    return `Plan de Clase Remedial - Aceptar Plan de Clase Remedial`;
  }
}

import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class ValidateRemedialPlanManagerEmail implements EmailStrategy {

  constructor(
    private readonly periodDisplayName: string,
    private readonly managerName: string,
    private readonly teacherName: string,
    private readonly subjectName: string,
    private readonly gradeDisplayName: string,
    private readonly classDate: string,
  ) {}

  getData() {
    const data = {
      periodDisplayName: this.periodDisplayName,
      managerName: this.managerName,
      teacherName: this.teacherName,
      subjectName: this.subjectName,
      gradeDisplayName: this.gradeDisplayName,
      remedialPlanDate: this.classDate
    //   url: `${process.env.FRONTEND}`,
    }
    return data;
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/manager/validate-remedial-plan.html', data);
  }
  getSubject(): string {
    return `Plan de Clase Remedial - Validar Plan de Clase Remedial`;
  }
}

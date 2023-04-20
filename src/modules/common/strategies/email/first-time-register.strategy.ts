import { getEmailTemplate } from "../../../../utils/template.utils";
import { EmailStrategy } from "../../interfaces/email/email-strategy.interface";

export class TeacherFisrtTimeLoginEmail implements EmailStrategy {
  getData() {
    return {};
  }
  getTemplate(data: any) {
    return getEmailTemplate('templates/email.html', data);
  }
  getSubject(): string {
    return 'Confirmación de correo electrónico';
  }
}

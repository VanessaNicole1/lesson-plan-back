import { EmailStrategy } from "../../../interfaces/email/email-strategy.interface";
import { getEmailTemplate } from "../../../../../utils/template.utils";

export class UnregisteredUserEmail implements EmailStrategy {
  constructor(
    private readonly registerToken: string,
    private readonly periodDisplayName: string,
    private readonly userName: string,
    private readonly periodStartDate: any
  ) {}

  getData() {
    const data: any = {
      periodDisplayName: this.periodDisplayName,
      userName: this.userName,
      periodStartDate: this.periodStartDate,
      url: `${process.env.FRONTEND}/auth/register/${this.registerToken}`
    };

    return data;
  }

  getTemplate(data: any) {
    return getEmailTemplate('templates/user/unregistered-user.html', data);
  }

  getSubject(): string {
    return 'Registro incompleto';
  }
}

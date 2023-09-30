import { getTransporter } from '../../../../utils/email.utils';
import { EmailStrategy } from '../../interfaces/email/email-strategy.interface';

export class SendEmail {
  constructor(private emailStrategy: EmailStrategy) {}

  sendEmail(receiver: string, emailSettings: { host, port, account, password, sender }) {
    const data = this.emailStrategy.getData();
    const template = this.emailStrategy.getTemplate(data);
    const subject = this.emailStrategy.getSubject();

    const transporter = getTransporter(emailSettings);

    transporter.sendMail({
      from: emailSettings.sender,
      to: receiver, 
      subject: subject,
      html: template
    })
    transporter.close();
  }
}

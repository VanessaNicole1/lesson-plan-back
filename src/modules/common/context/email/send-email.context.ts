import { getTransporter } from '../../../../utils/email.utils';
import { EmailStrategy } from '../../interfaces/email/email-strategy.interface';

export class SendEmail {
  constructor(private emailStrategy: EmailStrategy) {}

  sendEmail(receiver: string) {
    const data = this.emailStrategy.getData();
    const template = this.emailStrategy.getTemplate(data);
    const subject = this.emailStrategy.getSubject();

    const transporter = getTransporter();

    transporter.sendMail({
      from: process.env.EMAIL_ACCOUNT,
      to: receiver, 
      subject: subject,
      html: template
    })
    transporter.close();
  }
}

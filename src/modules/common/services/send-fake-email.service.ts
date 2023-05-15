import { EmailStrategy } from '../interfaces/email/email-strategy.interface';
import { EmailSender } from './email-sender.interface';

export class SendFakeEmailService implements EmailSender {
  sendEmail(emailStrategy: EmailStrategy, receiver: string) {
    console.log('Data:', JSON.stringify(emailStrategy.getData(), null, 4));
    console.log('Subject:', emailStrategy.getSubject());
    console.log('Receiver:', receiver);
    console.log('********************************')
  }
}

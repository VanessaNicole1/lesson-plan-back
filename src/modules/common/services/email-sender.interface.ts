import { EmailStrategy } from '../interfaces/email/email-strategy.interface';

export interface EmailSender {
  sendEmail(emailStrategy: EmailStrategy, receiver: string): void;
}

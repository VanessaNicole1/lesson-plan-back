import { Injectable } from "@nestjs/common";
import { EmailStrategy } from "../interfaces/email/email-strategy.interface";
import { SendEmail } from "../context/email/send-email.context";

@Injectable()
export class SendEmailService {
  constructor() {}

  sendEmail(emailStrategy: EmailStrategy, receiver: string) {
    const sendEmailContext = new SendEmail(emailStrategy);
    sendEmailContext.sendEmail(receiver);
  }
}

import { Injectable } from "@nestjs/common";
import { EmailStrategy } from "../interfaces/email/email-strategy.interface";
import { SendEmail } from "../context/email/send-email.context";
import { EmailSender } from "./email-sender.interface";

@Injectable()
export class SendEmailService implements EmailSender {
  constructor() {}

  sendEmail(emailStrategy: EmailStrategy, receiver: string) {
    const sendEmailContext = new SendEmail(emailStrategy);
    sendEmailContext.sendEmail(receiver);
  }
}

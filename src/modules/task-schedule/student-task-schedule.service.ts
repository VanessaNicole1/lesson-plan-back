import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SendEmailService } from '../common/services/send-email.service';
import { SendFakeEmailService } from '../common/services/send-fake-email.service';
import { StudentValidateLessonPlanEmail } from '../common/strategies/email/student/validate-lesson-plan.strategy';

@Injectable()
export class StudentTaskScheduleService {

  constructor(
    // private emailService: SendEmailService
    private emailService: SendFakeEmailService
  ) {}
  
  // Just one time only if the lesson plan has the option notify later.
  // @Cron('*/10 * * * * *')
  async studentValidateLessonPlanNotification() {
    const validateLessonPlanEmail = new StudentValidateLessonPlanEmail('', '', '', '', '', '');
    this.emailService.sendEmail(validateLessonPlanEmail, 'email');
  }
}

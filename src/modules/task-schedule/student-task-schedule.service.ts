import { Injectable } from '@nestjs/common';
import { StudentValidateLessonPlanEmail } from '../common/strategies/email/student/validate-lesson-plan.strategy';
import { StudentEndDateToValidateLessonPlanEmail } from '../common/strategies/email/student/end-date-to-validate-lesson-plan.strategy';
import { SendEmailServiceWrapper } from '../common/services/send-email-wrapper.service';

@Injectable()
export class StudentTaskScheduleService {

  constructor(
    private emailService: SendEmailServiceWrapper
  ) {}
  
  // Just one time only if the lesson plan has the option notify later.
  // @Cron('*/10 * * * * *')
  async studentValidateLessonPlanNotification() {
    const validateLessonPlanEmail = new StudentValidateLessonPlanEmail('', '', '', '', '', '');
    this.emailService.sendEmail(validateLessonPlanEmail, 'email');
  }

  // Every day at 8 am.
  async studentEndDateToValidateLessonPlanNotification () {
    const endDateToValidateLessonPlanEmail = new StudentEndDateToValidateLessonPlanEmail('', '', '', '', '');
    this.emailService.sendEmail(endDateToValidateLessonPlanEmail, 'email');
  }
}

import { StudentDeadlineValidationExpiredEmail } from './../common/strategies/email/student/deadline-lesson-plan-validation-expired.strategy';
import { Injectable } from '@nestjs/common';
import { StudentValidateLessonPlanEmail } from '../common/strategies/email/student/validate-lesson-plan.strategy';
import { StudentEndDateToValidateLessonPlanEmail } from '../common/strategies/email/student/end-date-to-validate-lesson-plan.strategy';
import { SendEmailServiceWrapper } from '../common/services/send-email-wrapper.service';
import { Cron } from '@nestjs/schedule';
import { LessonPlansService } from '../lesson-plans/lesson-plans.service';
import { convertToSpanishDate } from 'src/utils/date.utils';

@Injectable()
export class StudentTaskScheduleService {

  constructor(
    private emailService: SendEmailServiceWrapper,
    private lessonPlanService: LessonPlansService,
  ) {}
  
  // Just one time only if the lesson plan has the option notify later.
  // @Cron('0 8 * * *')
  async studentValidateLessonPlanNotification() {
    const lessonPlans = await this.lessonPlanService.getStudentsToNotify();
    for (let i = 0; i < lessonPlans.length; i++) {
      const lessonPlan = lessonPlans[i];
      const periodDisplayName = lessonPlan.schedule.grade.degree.period.displayName;
      const validationsTracking = lessonPlan.validationsTracking;
      const subjectName = lessonPlan.schedule.subject.name;
      const lessonPlanDate = new Date(lessonPlan.date);
      const spanishLessonPlanDate = convertToSpanishDate(lessonPlanDate);
      const maximumValidationDate = new Date(lessonPlan.maximumValidationDate);
      const spanishDeadlineDate = convertToSpanishDate(maximumValidationDate);
      const teacherName = lessonPlan.schedule.teacher?.user.displayName;
      for (const validationTracking of validationsTracking) {
        const currentStudent = validationTracking.student;
        const studentName = currentStudent.user.displayName;
        const studentEmail = currentStudent.user.email;
        const validateLessonPlanEmail = new StudentValidateLessonPlanEmail(periodDisplayName, studentName, subjectName, teacherName, spanishLessonPlanDate, spanishDeadlineDate);
        this.emailService.sendEmail(validateLessonPlanEmail, studentEmail);
      }
    }
  }

  // Every day at 8 am.
  async studentEndDateToValidateLessonPlanNotification () {
    const endDateToValidateLessonPlanEmail = new StudentEndDateToValidateLessonPlanEmail('', '', '', '', '');
    this.emailService.sendEmail(endDateToValidateLessonPlanEmail, 'email');
  }

  async studentDeadlineValidationHasExpired () {
    const deadlineValidationHasExpiredEmail = new StudentDeadlineValidationExpiredEmail('', '', '', '');
    this.emailService.sendEmail(deadlineValidationHasExpiredEmail, 'email');
  }

  @Cron('45 * * * * *')
  async test() {
    console.log('Hey there, this is a testing for cron');
  }
}

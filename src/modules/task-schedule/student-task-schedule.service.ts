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
  
  // Every day at 8 am.
  // Just one time only if the lesson plan has the option notify later.
  // @Cron('0 8 * * *')
  async studentValidateLessonPlanNotification() {
    const lessonPlans = await this.lessonPlanService.getLessonPlansToNotify();
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
        // this.emailService.sendEmail(validateLessonPlanEmail, studentEmail);
      }
    }
  }

  /**
   * Take into account: Deactivate the lesson plan to validate.
   */
  // Every day at 8 am.
  // @Cron('0 8 * * *')
  async studentEndDateToValidateLessonPlanNotification () {
    const lessonPlans = await this.lessonPlanService.getLessonPlansByDeadlineValidation();
    for (let i = 0; i < lessonPlans.length; i++) {
      const lessonPlan = lessonPlans[i];
      const periodDisplayName = lessonPlan.schedule.grade.degree.period.displayName;
      const subjectName = lessonPlan.schedule.subject.name;
      const teacherName = lessonPlan.schedule.teacher?.user.displayName;
      const lessonPlanDate = new Date(lessonPlan.date);
      const spanishLessonPlanDate = convertToSpanishDate(lessonPlanDate);
      const validationsTracking = lessonPlan.validationsTracking;
      for (const validationTracking of validationsTracking) {
        const currentStudent = validationTracking.student;
        const studentName = currentStudent.user.displayName;
        const studentEmail = currentStudent.user.email;
        const endDateToValidateLessonPlanEmail = new StudentEndDateToValidateLessonPlanEmail(periodDisplayName, studentName, subjectName, teacherName, spanishLessonPlanDate);
        this.emailService.sendEmail(endDateToValidateLessonPlanEmail, studentEmail);
      }
    }
  }

  // @Cron('0 18 * * *')
  async studentDeadlineValidationHasExpired () {
    const lessonPlans = await this.lessonPlanService.getLessonPlansByDeadlineValidation();
    for (let i = 0; i < lessonPlans.length; i++) {
      const lessonPlan = lessonPlans[i];
      const periodDisplayName = lessonPlan.schedule.grade.degree.period.displayName;
      const subjectName = lessonPlan.schedule.subject.name;
      const teacherName = lessonPlan.schedule.teacher?.user.displayName;
      const validationsTracking = lessonPlan.validationsTracking;
      for (const validationTracking of validationsTracking) {
        const currentStudent = validationTracking.student;
        const studentName = currentStudent.user.displayName;
        const studentEmail = currentStudent.user.email;
        const deadlineValidationHasExpiredEmail = new StudentDeadlineValidationExpiredEmail(periodDisplayName, studentName, subjectName, teacherName);
        this.emailService.sendEmail(deadlineValidationHasExpiredEmail, studentEmail);
      }
    }
  }
}

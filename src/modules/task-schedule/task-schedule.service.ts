import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TeachersService } from '../teachers/teachers.service';
import { SendEmailService } from '../common/services/send-email.service';
import { TeacherScheduleNotFilledEmail } from '../common/strategies/email/teacher/schedule-not-filled.strategy';
import { PeriodsService } from '../periods/periods.service';
import { TeacherAD2NotFilledEmail } from '../common/strategies/email/teacher/ad2-not-filled.strategy';
import { SendFakeEmailService } from '../common/services/send-fake-email.service';
import { TeacherNotLessonPlanForAWeekEmail } from '../common/strategies/email/teacher/not-lesson-plan-for-a-week.strategy';
import { TeacherMissingStudentsToGradedLessonPlanEmail } from '../common/strategies/email/teacher/missing-students-to-graded-lp.strategy';

@Injectable()
export class TaskScheduleService {

  constructor(
    private teacherService: TeachersService,
    private periodService: PeriodsService,
    // private emailService: SendEmailService
    private emailService: SendFakeEmailService
  ) {}
  
  // Every day at 8 AM, after 3 days of period creation.
  // @Cron('*/10 * * * * *')
  async teacherScheduleNotFilledNotification() {
    const teachersWithEmptySchedulesConfig = await this.teacherService.findTeachersWithEmptySchedulesConfigInActivePeriods();

    for (const teacher of teachersWithEmptySchedulesConfig) {
      const { user, schedules, periodId } = teacher;
      const period = await this.periodService.findOne(periodId);

      if (schedules.length > 0) {
        const scheduleNotFilledEmail = new TeacherScheduleNotFilledEmail(period.displayName, user.displayName, schedules);
        this.emailService.sendEmail(scheduleNotFilledEmail, user.email);
      }
    }
  }

  // Every day at 8 AM, after 3 days of period creation.
  // @Cron('*/10 * * * * *')
  async teacherAD2NotFilledNotification() {
    const teachersWithEmptyAD2OrCustomNotification = await this.teacherService.findTeachersWithEmptyAD2OrCustomNotificationsInActivePeriods();
    const notificationWays = 2;

    for (const teacher of teachersWithEmptyAD2OrCustomNotification) {
      const { user, periodId, eventsConfig } = teacher;
      const period = await this.periodService.findOne(periodId);

      if (eventsConfig.length === notificationWays) {
        const ad2NotFilledEmail = new TeacherAD2NotFilledEmail(period.displayName, user.displayName);
        this.emailService.sendEmail(ad2NotFilledEmail, user.email);
      }
    }
  }

  // Every Friday at 8 AM.
  async teacherNotLessonPlanForAWeekNotification() {
    // TODO: Do not forget to put all the necessary logic here!
    const notLessonPlanForAWeekEmail = new TeacherNotLessonPlanForAWeekEmail('', '');
    this.emailService.sendEmail(notLessonPlanForAWeekEmail, 'email')
  }

  // Every day 
  async teacherMissingStudentsToGradedLessonPlanNotification() {
    const missingStudentsToGradedLessonPlanEmail = new TeacherMissingStudentsToGradedLessonPlanEmail(
      '',
      '',
      '',
      [],
      '',
      ''
    );
    this.emailService.sendEmail(missingStudentsToGradedLessonPlanEmail, 'email');
  }
}

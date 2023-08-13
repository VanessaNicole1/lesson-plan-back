import { Injectable } from '@nestjs/common';
import { TeachersService } from '../teachers/teachers.service';
import { TeacherScheduleNotFilledEmail } from '../common/strategies/email/teacher/schedule-not-filled.strategy';
import { PeriodsService } from '../periods/periods.service';
import { TeacherAD2NotFilledEmail } from '../common/strategies/email/teacher/ad2-not-filled.strategy';
import { TeacherNotLessonPlanForAWeekEmail } from '../common/strategies/email/teacher/not-lesson-plan-for-a-week.strategy';
import { TeacherMissingStudentsToValidateLessonPlanEmail } from '../common/strategies/email/teacher/missing-students-to-graded-lp.strategy';
import { CronService } from '../common/services/cron.service';
import { convertToSpanishDate, getLastWeekFromMondayDay, hasPassedAmountOfDays } from '../../utils/date.utils';
import { SendEmailServiceWrapper } from '../common/services/send-email-wrapper.service';
import { TecaherAd2Notification } from '../common/strategies/email/teacher/ad2-notification.strategy';

@Injectable()
export class TeacherTaskScheduleService {

  constructor(
    private teacherService: TeachersService,
    private periodService: PeriodsService,
    private emailService: SendEmailServiceWrapper
  ) {}
  
  /**
   * Monday - Friday at 8am after 3 dyas of period creation.
   * It will notify teachers who haven't filled their schedule.
   */
  @CronService.ProdCron('0 8 * * 1-5')
  async teacherScheduleNotFilledNotification() {
    const teachersWithEmptySchedulesConfig = await this.teacherService.findTeachersWithEmptySchedulesConfigInActivePeriods();

    for (const teacher of teachersWithEmptySchedulesConfig) {
      const { user, schedules, periodId } = teacher;
      const period = await this.periodService.findOne(periodId);
      
      const hasPassed3Days = hasPassedAmountOfDays(period.createdAt, 3, 8);

      if (schedules.length > 0 && hasPassed3Days) {
        const scheduleNotFilledEmail = new TeacherScheduleNotFilledEmail(period.displayName, user.displayName, schedules);
        this.emailService.sendEmail(scheduleNotFilledEmail, user.email);
      }
    }
  }

  /**
   * Monday - Friday at 8am after 3 days of period creation
   * It will notify teachers who haven't filled AD2 or Custom notifications
   */
  @CronService.ProdCron('0 8 * * 1-5')
  async teacherAD2NotFilledNotification() {
    const teachersWithEmptyAD2OrCustomNotification = await this.teacherService.findTeachersWithEmptyAD2OrCustomNotificationsInActivePeriods();
    const notificationWays = 2;

    for (const teacher of teachersWithEmptyAD2OrCustomNotification) {
      const { user, periodId, eventsConfig } = teacher;
      const period = await this.periodService.findOne(periodId);

      const hasPassed3Days = hasPassedAmountOfDays(period.createdAt, 3, 8);

      if (eventsConfig.length === notificationWays && hasPassed3Days) {
        const ad2NotFilledEmail = new TeacherAD2NotFilledEmail(period.displayName, user.displayName);
        this.emailService.sendEmail(ad2NotFilledEmail, user.email);
      }
    }
  }

  /**
   * Every Monday at 8am.
   * It will notify teachers who haven't created any lesson plan in the last week.
   */
  @CronService.ProdCron("0 8 * * 1")
  async teacherNotLessonPlanForLastWeekNotification() {
    const activePeriods = await this.periodService.findActivePeriods();
    const periodIds = activePeriods.map(period => period.id);
    const { from, to } = getLastWeekFromMondayDay();
    const teachersWithNotLessonPlanInTheLastWeek = await this.teacherService.findTeachersWithEmptyLessonPlansBetweenDates(
      from,
      to,
      periodIds
    );

    for (const teacher of teachersWithNotLessonPlanInTheLastWeek) {
      const teacherPeriod = activePeriods.find(period => teacher.periodId === period.id);
      const notLessonPlanForAWeekEmail = new TeacherNotLessonPlanForAWeekEmail(
        teacherPeriod.displayName,
        teacher.user.displayName,
        convertToSpanishDate(from),
        convertToSpanishDate(to),
      );
      this.emailService.sendEmail(notLessonPlanForAWeekEmail, teacher.user.email);
    }
  }

  /**
   * Monday - Friday from 7am to 18pm every 30 minutes.
   * It will notify teachers to remember to fill out a Lesson plan.
   */
  @CronService.ProdCron("30 7-18/1 * * 1-5")
  async notifyToFillOutLessonPlan() {
    const activePeriods = await this.periodService.findActivePeriods();
    const periodsIds = activePeriods.map(period => period.id);
    const teacherEventsConfig = await this.teacherService.findTeachersEventsConfigByPeriodIds(periodsIds);
    const teacherEventsConfigGroupedByTeacher = [];
    for (const eventConfig of teacherEventsConfig) {
      const eventConfigIndex = teacherEventsConfigGroupedByTeacher.findIndex(event => event.teacherId === eventConfig.teacherId);
      if (eventConfigIndex !== -1) {
        teacherEventsConfigGroupedByTeacher[eventConfigIndex]?.events.push(eventConfig);
      } else {
        const element = {
          teacherId: eventConfig.teacherId,
          events: [eventConfig]
        }
        teacherEventsConfigGroupedByTeacher.push(element);
      }
    }

    for (const eventConfig of teacherEventsConfigGroupedByTeacher) {
      const mainEventName = "Notificaciones Personalizadas";
      const alternativeEventName = "AD2";

      const checkEventByName = (eventName) => event => event.eventName.toLowerCase() === eventName.toLowerCase();

      const mainEvent = 
        eventConfig.events.find(checkEventByName(mainEventName)) ||
        eventConfig.events.find(checkEventByName(alternativeEventName));

      const daysMapping = {
        1: "LUNES",
        2: "MARTES",
        3: "MIERCOLES",
        4: "JUEVES",
        5: "VIERNES",
      };

      const currentDate = new Date("2023-08-10T07:30:00.943");
      const currentTime = `${currentDate.getHours()}:30`;
      const currentDay = daysMapping[currentDate.getDay()];
      const currentEventDay = mainEvent.metadata.days.find(day => day.name === currentDay);

      if (!currentEventDay) {
        return;
      }

      const currentEventTime = currentEventDay.times.filter(time => time.start === currentTime);

      if (!currentEventTime) {
        return;
      }

      const period = activePeriods.find(period => period.id === mainEvent.periodId);
      const ad2NotificationEmail = new TecaherAd2Notification(period.displayName, mainEvent.teacher.user.displayName);
      this.emailService.sendEmail(ad2NotificationEmail, mainEvent.teacher.user.email);
    }
  }

  // Every day 
  async teacherMissingStudentsToGradedLessonPlanNotification() {
    const missingStudentsToGradedLessonPlanEmail = new TeacherMissingStudentsToValidateLessonPlanEmail(
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

import { LessonPlan } from 'src/lesson-plan/lesson-plan.entity';
export class RatedStudentLessonPlan {
  lessonPlans: LessonPlan[];
  rated: boolean;
  timely: boolean;
}

import { LessonPlan } from 'src/lesson-plan/lesson-plan.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('lessonPlan_student')
export class LessonPlanToStudent {
  @Column()
  @PrimaryColumn()
  studentId: string;

  @Column()
  @PrimaryColumn()
  lessonPlanId: string;

  @Column()
  rated: boolean;

  @Column()
  timely: boolean;

  @ManyToOne(() => Student, (student) => student.lessonPlanToStudent)
  student: Student;

  @ManyToOne(() => LessonPlan, (lessonPlan) => lessonPlan.lessonPlanToStudent)
  lessonPlan: LessonPlan;
}

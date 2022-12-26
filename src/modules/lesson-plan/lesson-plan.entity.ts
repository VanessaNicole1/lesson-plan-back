import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { StudentLessonPlan } from '../student-lesson-plan/student-lesso-plan-entity';
@Entity()
export class LessonPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @Column()
  topic: string;

  @Column()
  content: string;

  @Column()
  comment: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.lessonPlans)
  schedule: Schedule;

  @OneToMany(
    () => StudentLessonPlan,
    (studentLessonPlan) => studentLessonPlan.student,
  )
  studentLessonPlan: StudentLessonPlan[];
}

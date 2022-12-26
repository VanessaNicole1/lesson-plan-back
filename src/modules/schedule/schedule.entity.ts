import { Subject } from '../subjects/subject.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { Teacher } from '../teachers/teacher.entity';
import { LessonPlan } from '../lesson-plan/lesson-plan.entity';
@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startHour: string;

  @Column()
  endHour: string;

  @Column()
  day: string;

  @ManyToOne(() => Grade, (grade) => grade.schedule)
  grade: Grade;

  @ManyToOne(() => Subject, (subject) => subject.schedule)
  subject: Subject;

  @ManyToOne(() => Teacher, (teacher) => teacher.schedule)
  teacher: Teacher;

  @OneToMany(() => LessonPlan, (lessonPlan) => lessonPlan.schedule)
  lessonPlans: LessonPlan[];
}

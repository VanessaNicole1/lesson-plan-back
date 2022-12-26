import { LessonPlan } from '../lesson-plan/lesson-plan.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class StudentLessonPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  isValidated: boolean;

  @ManyToOne(() => Student, (student) => student.studentLessonPlan)
  student: Student;

  @ManyToOne(() => LessonPlan, (lessonPlan) => lessonPlan.studentLessonPlan)
  lessonPlan: LessonPlan;
}

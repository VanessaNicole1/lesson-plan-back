import { LessonPlan } from 'src/lesson-plan/lesson-plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { LessonPlanToStudent } from './lessonPlanToStudent.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Grade, (grade) => grade.students)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @OneToMany(
    () => LessonPlanToStudent,
    (lessonPlanToStudent) => lessonPlanToStudent.student,
  )
  lessonPlanToStudent: LessonPlanToStudent[];

  @ManyToMany(() => LessonPlan, (lessonPlan) => lessonPlan.students)
  @JoinTable({
    name: 'lessonPlan_student',
    joinColumn: {
      name: 'studentId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'lessonPlanId',
      referencedColumnName: 'id',
    },
  })
  lessonPlans: LessonPlan[];
}

import { User } from 'src/modules/user/user-entity';
import {
  JoinColumn,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { StudentLessonPlan } from '../student-lesson-plan/student-lesso-plan-entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade, (grade) => grade.students)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @ManyToOne(() => User, (user) => user.student)
  user: User;

  @OneToMany(
    () => StudentLessonPlan,
    (studentLessonPlan) => studentLessonPlan.student,
  )
  studentLessonPlan: StudentLessonPlan[];
}

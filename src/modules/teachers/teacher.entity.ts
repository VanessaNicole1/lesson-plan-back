import { User } from 'src/user/user-entity';
import { Subject } from 'src/modules/subjects/subject.entity';
import {
  JoinTable,
  ManyToMany,
  OneToMany,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonPlan } from '../lesson-plan/lesson-plan.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => LessonPlan, (plan) => plan.teacher)
  plans: LessonPlan[];

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable({
    name: 'subject_teacher',
    joinColumn: {
      name: 'teacher_id',
    },
    inverseJoinColumn: {
      name: 'subject_id',
    },
  })
  subjects: Subject[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

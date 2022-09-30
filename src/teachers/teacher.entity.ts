import { Subject } from 'src/subjects/subject.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonPlan } from '../lesson-plan/lesson-plan.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

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
}

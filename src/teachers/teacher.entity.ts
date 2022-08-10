import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
}

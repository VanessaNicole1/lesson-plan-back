import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LessonPlan } from '../lesson-plan/lesson-plan.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => LessonPlan, (plan) => plan.subject)
  plans: LessonPlan[];
}

import { Grade } from 'src/modules/grade/grade.entity';
import { Teacher } from 'src/modules/teachers/teacher.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { LessonPlan } from '../lesson-plan/lesson-plan.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => LessonPlan, (plan) => plan.subject)
  plans: LessonPlan[];

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];

  @ManyToOne(() => Grade, (grade) => grade.subjects)
  grade: Grade;
}

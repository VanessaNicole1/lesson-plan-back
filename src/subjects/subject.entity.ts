import { Grade } from 'src/grade/grade.entity';
import { Teacher } from 'src/teachers/teacher.entity';
import { TeacherToSubject } from 'src/teachers/teacherToSubject.entity';
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

  @OneToMany(
    () => TeacherToSubject,
    (teacherToSubject) => teacherToSubject.subject,
  )
  teacherToSubject: TeacherToSubject[];

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];

  @ManyToOne(() => Grade, (grade) => grade.subjects)
  grade: Grade;
}

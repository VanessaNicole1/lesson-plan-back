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
import { TeacherToSubject } from './teacherToSubject.entity';

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

  @OneToMany(
    () => TeacherToSubject,
    (teacherToSubject) => teacherToSubject.teacher,
  )
  teacherToSubject: TeacherToSubject[];

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable({
    name: 'subject_teacher',
    joinColumn: {
      name: 'teacherId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'subjectId',
      referencedColumnName: 'id',
    },
  })
  subjects: Subject[];
}

import { LessonPlanToStudent } from 'src/students/lessonPlanToStudent.entity';
import { Student } from 'src/students/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { Teacher } from '../teachers/teacher.entity';

@Entity()
export class LessonPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @Column()
  grade: string;

  @Column()
  topic: string;

  @Column()
  content: string;

  @Column()
  comment: string;

  @ManyToOne(() => Subject, (subject) => subject.plans)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Teacher, (teacher) => teacher.plans)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.lessonPlans)
  students: Student[];

  @OneToMany(
    () => LessonPlanToStudent,
    (lessonPlanToStudent) => lessonPlanToStudent.lessonPlan,
  )
  lessonPlanToStudent: LessonPlanToStudent[];
}

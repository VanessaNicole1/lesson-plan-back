import { Subject } from 'src/subjects/subject.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
@Entity('subject_teacher')
export class TeacherToSubject {
  @Column()
  @PrimaryColumn()
  teacherId: string;

  @Column()
  @PrimaryColumn()
  subjectId: string;

  @Column()
  day: string;

  @Column()
  hour: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.teacherToSubject)
  teacher: Teacher;

  @ManyToOne(() => Subject, (subject) => subject.teacherToSubject)
  subject: Subject;
}

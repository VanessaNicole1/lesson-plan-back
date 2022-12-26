import { Degree } from 'src/modules/degree/degree.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { Student } from '../students/student.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numberParallel: number;

  @Column()
  parallel: string;

  @Column()
  displayName: string;

  @OneToMany(() => Student, (student) => student.grade)
  students: Student[];

  @ManyToOne(() => Degree, (degree) => degree.grades)
  degree: Degree;

  @OneToMany(() => Schedule, (schedule) => schedule.grade)
  schedule: Schedule[];
}

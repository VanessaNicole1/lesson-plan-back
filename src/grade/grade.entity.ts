import { Degree } from 'src/degree/degree.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column()
  parallel: string;

  @OneToMany(() => Student, (student) => student.grade)
  students: Student[];

  @ManyToOne(() => Degree, (degree) => degree.grades)
  degree: Degree;
}

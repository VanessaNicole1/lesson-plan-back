import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Grade, (grade) => grade.students)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;
}

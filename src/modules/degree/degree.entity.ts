import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { Period } from '../period/period.entity';

@Entity()
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Period, (period) => period.degrees)
  period: Period;

  @OneToMany(() => Grade, (grade) => grade.degree)
  grades: Grade[];
}

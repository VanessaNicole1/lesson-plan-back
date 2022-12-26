import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { Manager } from '../manager/manager.entity';
import { Period } from '../period/period.entity';

@Entity()
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Manager)
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;

  @ManyToOne(() => Period, (period) => period.degrees)
  period: Period;

  @OneToMany(() => Grade, (grade) => grade.degree)
  grades: Grade[];
}

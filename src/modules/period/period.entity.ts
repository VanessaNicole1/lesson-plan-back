import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToOne(() => Degree)
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;
}
